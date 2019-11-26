# Mattermost Screen Recording Plugin

This plugin adds support for basic **screen recording** in Mattermost.

## Why?

- [GIF](https://en.wikipedia.org/wiki/GIF) format is great but it's not meant for screen recording. Video is the solution.
- It can be very time consuming to find a program that captures your screen, configuring and running it. Your browser is the solution.

## Demo

A demo server running the latest version of this plugin is located [here](https://mm.krad.stream/testing/channels/town-square).
You can login using the following details:

```
Username: demo
Password: password
```

## Usage

To capture your screen and send the recording click on the post attachment icon and click on *Screen recording*.

## Installation

1. Download the latest version from the [release page](https://github.com/streamer45/mattermost-plugin-screen/releases).
2. Upload the file through **System Console > Plugins > Plugin Management**, or manually upload it to the Mattermost server under plugin directory. See [documentation](https://docs.mattermost.com/administration/plugins.html#set-up-guide) for more details.

## Development

Use ```make dist``` to build this plugin.

Use `make deploy` to deploy the plugin to your local server.

Before running `make deploy` you need to set a few environment variables:

```
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_USERNAME=admin
export MM_ADMIN_PASSWORD=password
```

For more details on how to develop a plugin refer to the official [documentation](https://developers.mattermost.com/extend/plugins/).

## Limitations

- Webapp: screen recording works on Chrome 72+ only.
- Desktop App: can only record full desktop.

## License

[mattermost-plugin-screen](https://github.com/streamer45/mattermost-plugin-screen) is licensed under [Apache-2.0](LICENSE)   
[mux.js](https://github.com/videojs/mux.js) is licensed under [Apache-2.0](https://github.com/videojs/mux.js/blob/master/LICENSE)  
[ts-ebml](https://github.com/legokichi/ts-ebml) is licensed under [MIT](https://opensource.org/licenses/MIT)   
