export default {
    "commands": [
        {
            "command": "play",
            "description": "Play a sound or add one to the queue",
            "category": "music",
            "code": "play [sound_name]"
        },
        {
            "command": "skip",
            "description": "Skip to the next song on queue",
            "category": "music",
            "code": "skip"
        },
        {
            "command": "pause",
            "description": "Pause the current song",
            "category": "music",
            "code": "pause"
        },
        {
            "command": "resume",
            "description": "Resume the current song",
            "category": "music",
            "code": "resume"
        },
        {
            "command": "sounds",
            "description": "List all available sounds",
            "category": "music",
            "code": "sounds"
        },
        {
            "command": "custom",
            "description": "Play a custom sound",
            "category": "music",
            "code": "custom [sound_link or sound_name]"
        },
        {
            "command": "stop",
            "description": "Stop playing music and delete the server queue",
            "category": "music",
            "code": "stop"
        },
        {
            "command": "random",
            "description": "Play a random calming sound",
            "category": "music",
            "code": "random"
        },
        {
            "command": "playlist",
            "description": "Plays a playlist of calming sounds",
            "category": "music",
            "code": "playlist"
        },
        {
            "command": "remove",
            "description": "Remove a song from the queue by position",
            "category": "music",
            "code":  "remove [sound_index]"
        },
        {
            "command": "loop",
            "description": "Loop a song",
            "category": "music",
            "code": "loop"
        },
        {
            "command": "queue",
            "description": "Display songs in the queue",
            "category": "queue",
            "code": "queue"
        },
        {
            "command": "repeatQueue",
            "description": "Repeat server sound queue",
            "category": "queue",
            "code": "repeatQueue"
        },
        {
            "command": "disableRepeatQueue",
            "description": "Repeat server sound queue",
            "category": "queue",
            "code": "disableRepeatQueue"
        },
        {
            "command": "progress",
            "description": "View progess bar of current song",
            "category": "music",
            "code": "progress"
        },
        {
            "command": "categories",
            "description": "View music categories",
            "category": "sound",
            "code": "categories"
        },
        {
            "command": "search",
            "description": "Search for songs",
            "category": "sound",
            "code": "search"
        },
        {
            "command": "shuffle",
            "description": "Shuffle Songs in Server Queue",
            "category": "queue",
            "code":  "shuffle"
        },
        {
            "command": "setvolume",
            "description": "Set Sound Volume",
            "category": "settings",
            "code": "setvolume [percentage]"
        },
        {
            "command": "help",
            "description": "List commands or give information about a command",
            "category": "settings",
            "code": "help"
        },
        {
            "command": "commands",
            "description": "List commands of the bot",
            "category": "settings",
            "code": "commands"
        },
        {
            "command": "command",
            "description": "View information about a specific command",
            "category": "settings",
            "code": "command [command_name]"
        },
        {
            "command": "settings",
            "description": "Set specific settings on the bot",
            "category": "settings",
            "code": "settings"
        },
        {
            "command": "prefix",
            "description": "Set a specific prefix for the bot",
            "category": "settings",
            "code": "prefix [prefix]"
        }
    ]
}