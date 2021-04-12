import {getCommandWithPrefix} from "../scripts/getCommands";

export default {
    "commands": [
        {
            "command": "play",
            "description": "Play a sound or add one to the queue",
            "category": "music",
            "code": getCommandWithPrefix("play [sound_name]")
        },
        {
            "command": "skip",
            "description": "Skip to the next song on queue",
            "category": "music",
            "code": getCommandWithPrefix("skip")
        },
        {
            "command": "pause",
            "description": "Pause the current song",
            "category": "music",
            "code": getCommandWithPrefix("pause")
        },
        {
            "command": "resume",
            "description": "Resume the current song",
            "category": "music",
            "code": getCommandWithPrefix("resume")
        },
        {
            "command": "sound",
            "description": "Please a specific soung",
            "category": "music",
            "code": getCommandWithPrefix("sound [sound_name]")
        },
        {
            "command": "sounds",
            "description": "List all available sounds",
            "category": "music",
            "code": getCommandWithPrefix("sounds")
        },
        {
            "command": "custom",
            "description": "Play a custom sound",
            "category": "music",
            "code": getCommandWithPrefix("custom [sound_link or sound_name]")
        },
        {
            "command": "stop",
            "description": "Stop playing music and delete the server queue",
            "category": "music",
            "code": getCommandWithPrefix("stop")
        },
        {
            "command": "remove",
            "description": "Remove a song from the queue by position",
            "category": "music",
            "code":  getCommandWithPrefix("remove [sound_index]")
        },
        {
            "command": "loop",
            "description": "Loop a song",
            "category": "music",
            "code": getCommandWithPrefix("loop")
        },
        {
            "command": "queue",
            "description": "Display songs in the queue",
            "category": "queue",
            "code": getCommandWithPrefix("queue")
        },
        {
            "command": "repeatQueue",
            "description": "Repeat server sound queue",
            "category": "queue",
            "code": getCommandWithPrefix("repeatQueue")
        },
        {
            "command": "disableRepeatQueue",
            "description": "Repeat server sound queue",
            "category": "queue",
            "code": getCommandWithPrefix("disableRepeatQueue")
        },
        {
            "command": "progress",
            "description": "View progess bar of current song",
            "category": "music",
            "code": getCommandWithPrefix("progress")
        },
        {
            "command": "categories",
            "description": "View music categories",
            "category": "sound",
            "code": getCommandWithPrefix("categories")
        },
        {
            "command": "search",
            "description": "Search for songs",
            "category": "sound",
            "code": getCommandWithPrefix("search")
        },
        {
            "command": "shuffle",
            "description": "Shuffle Songs in Server Queue",
            "category": "queue",
            "code":  getCommandWithPrefix("shuffle")
        },
        {
            "command": "setVolume",
            "description": "Set Sound Volume",
            "category": "settings",
            "code": getCommandWithPrefix("setVolume [percentage]")
        },
        {
            "command": "help",
            "description": "List commands or give information about a command",
            "category": "settings",
            "code": getCommandWithPrefix("help")
        },
        {
            "command": "commands",
            "description": "List commands of the bot",
            "category": "settings",
            "code": getCommandWithPrefix("commands")
        },
        {
            "command": "command",
            "description": "View information about a specific command",
            "category": "settings",
            "code": getCommandWithPrefix("command [command_name]")
        },
        {
            "command": "settings",
            "description": "Set specific settings on the bot",
            "category": "settings",
            "code": getCommandWithPrefix("settings")
        }
    ]
}