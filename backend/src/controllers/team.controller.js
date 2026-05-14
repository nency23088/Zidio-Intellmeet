import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import Team from "../models/Team.js";
import User from "../models/User.js";

function isMember(team, userId) {
  return team.members.some((m) => String(m) === String(userId));
}

function canEditTeam(team, user, role) {
  if (role === "admin") return true;
  return isMember(team, user._id);
}

export const createTeam = asyncHandler(async (req, res) => {
  const team = await Team.create({
    name: req.body.name,
    members: [req.user._id],
    projects: req.body.projects || [],
  });
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { teams: team._id } });
  const populated = await Team.findById(team._id).populate("members", "name email role avatar");
  res.status(201).json({ team: populated });
});

export const listTeams = asyncHandler(async (req, res) => {
  const q = req.user.role === "admin" ? {} : { members: req.user._id };
  const teams = await Team.find(q).populate("members", "name email role avatar");
  res.json({ teams });
});

export const getTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id).populate("members", "name email role avatar");
  if (!team) throw new AppError("Team not found", 404);
  if (req.user.role !== "admin" && !isMember(team, req.user._id)) {
    throw new AppError("Team not found", 404);
  }
  res.json({ team });
});

export const updateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) throw new AppError("Team not found", 404);
  if (!canEditTeam(team, req.user, req.user.role)) {
    throw new AppError("Not allowed to update this team", 403);
  }
  if (req.body.name !== undefined) team.name = req.body.name;
  if (req.body.projects !== undefined) team.projects = req.body.projects;
  if (req.body.memberIds !== undefined) {
    const ids = [...new Set(req.body.memberIds.map(String))];
    team.members = ids;
    await User.updateMany({ teams: team._id }, { $pull: { teams: team._id } });
    await User.updateMany({ _id: { $in: ids } }, { $addToSet: { teams: team._id } });
  }
  await team.save();
  const populated = await Team.findById(team._id).populate("members", "name email role avatar");
  res.json({ team: populated });
});

export const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) throw new AppError("Team not found", 404);
  if (req.user.role === "admin") {
    await User.updateMany({ teams: team._id }, { $pull: { teams: team._id } });
    await team.deleteOne();
    return res.json({ message: "Team deleted" });
  }
  if (!isMember(team, req.user._id)) throw new AppError("Team not found", 404);
  if (String(team.members[0]) !== String(req.user._id)) {
    throw new AppError("Only team owner or admin can delete", 403);
  }
  await User.updateMany({ teams: team._id }, { $pull: { teams: team._id } });
  await team.deleteOne();
  res.json({ message: "Team deleted" });
});
