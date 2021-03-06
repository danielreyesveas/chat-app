const userResolvers = require("./users");
const messageResolvers = require("./messages");
const notificationResolvers = require("./notifications");
const threadResolvers = require("./threads");

const {
	Message,
	User,
	Notification,
	Sub,
	Post,
	Comment,
	Thread,
} = require("../../models");

module.exports = {
	Message: {
		createdAt: (parent) => parent.createdAt.toISOString(),
		thread: async (parent) => await Thread.findByPk(parent.messageId),
	},
	Notification: {
		createdAt: (parent) => parent.createdAt.toISOString(),
		user: async (parent) =>
			await User.findOne(
				{ where: { username: parent.username } },
				{
					attributes: ["username", "imageUrl", "createdAt"],
				}
			),
		sender: async (parent) =>
			await User.findOne(
				{ where: { username: parent.sendername } },
				{
					attributes: ["username", "imageUrl", "createdAt"],
				}
			),
		sub: async (parent) =>
			await Sub.findOne(
				{ where: { name: parent.subName } },
				{
					attributes: [
						"title",
						"name",
						"username",
						"imageUrl",
						"createdAt",
					],
				}
			),
		post: async (parent) =>
			await Post.findByPk(parent.postId, {
				attributes: [
					"identifier",
					"title",
					"subName",
					"slug",
					"username",
					"createdAt",
				],
			}),
		comment: async (parent) =>
			await Comment.findByPk(parent.commentId, {
				attributes: ["identifier", "body", "username", "createdAt"],
			}),
	},
	User: {
		createdAt: (parent) => parent.createdAt.toISOString(),
	},
	Thread: {
		createdAt: (parent) => parent.createdAt.toISOString(),
		updatedAt: (parent) => parent.createdAt.toISOString(),
	},
	Reaction: {
		createdAt: (parent) => parent.createdAt.toISOString(),
		message: async (parent) => await Message.findByPk(parent.messageId),
		user: async (parent) =>
			await User.findByPk(parent.userId, {
				attributes: ["username", "imageUrl", "createdAt"],
			}),
	},
	Query: {
		...userResolvers.Query,
		...messageResolvers.Query,
		...notificationResolvers.Query,
		...threadResolvers.Query,
	},
	Mutation: {
		...userResolvers.Mutation,
		...messageResolvers.Mutation,
		...notificationResolvers.Mutation,
	},
	Subscription: {
		...messageResolvers.Subscription,
		...notificationResolvers.Subscription,
	},
};
