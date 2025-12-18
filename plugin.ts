import TokenRingApp, {TokenRingPlugin} from "@tokenring-ai/app";
import { CheckpointPluginConfigSchema } from "@tokenring-ai/checkpoint";
import AgentCheckpointService from "@tokenring-ai/checkpoint/AgentCheckpointService";
import BrowserAgentStateStorage, {
	BrowserAgentStateStorageOptionsSchema,
} from "./BrowserAgentStateStorage.js";
import packageJSON from "./package.json" with { type: "json" };


export default {
	name: packageJSON.name,
	version: packageJSON.version,
	description: packageJSON.description,
	install(app: TokenRingApp) {
		const config = app.getConfigSlice(
			"checkpoint",
			CheckpointPluginConfigSchema,
		);

		if (config) {
			app.services
				.waitForItemByType(AgentCheckpointService, (checkpointService) => {
					for (const name in config.providers) {
						const provider = config.providers[name];
						if (provider.type === "browser") {
							checkpointService.registerProvider(
								name,
								new BrowserAgentStateStorage(
									BrowserAgentStateStorageOptionsSchema.parse(provider),
								),
							);
						}
					}
				});
		}
	},
} satisfies TokenRingPlugin;
