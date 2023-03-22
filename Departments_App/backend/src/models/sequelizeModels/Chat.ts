import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../db/index.js';
import { user } from './User.js';

export interface ChatModel extends Model<InferAttributes<ChatModel>, InferCreationAttributes<ChatModel>> {
    id: CreationOptional<number>;
    userId: number;
    receiverUserId?: number;
    chatName?: string;
    messages?: MessageModel[];
    users?: any;
}

export interface MessageModel extends Model<InferAttributes<MessageModel>, InferCreationAttributes<MessageModel>> {
    id: CreationOptional<number>;
    chatId: number;
    userId: number;
    text: string;
}

export interface ChatUserModel extends Model<InferAttributes<ChatUserModel>, InferCreationAttributes<ChatUserModel>> {
    id: CreationOptional<number>;
    chatId: number;
    userId: number;
}

const chat = sequelize.define<ChatModel>('chat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user,
            key: 'id'
        }
    },
    chatName: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

const message = sequelize.define<MessageModel>('message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: chat,
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user,
            key: 'id'
        }
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

const chatUser = sequelize.define<ChatUserModel>('chatuser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: chat,
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user,
            key: 'id'
        }
    }
});

chat.hasMany(message);
message.belongsTo(chat);

user.hasMany(message);
message.belongsTo(user);

chat.belongsToMany(user, { through: { model: chatUser, unique: false } });
user.belongsToMany(chat, { through: { model: chatUser, unique: false } });

export { chat, message, chatUser };
