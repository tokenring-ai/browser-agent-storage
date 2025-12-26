import {TokenRingPlugin} from "@tokenring-ai/app";
import {CheckpointPluginConfigSchema} from "@tokenring-ai/checkpoint";
import AgentCheckpointService from "@tokenring-ai/checkpoint/AgentCheckpointService";
import {z} from "zod";
import BrowserAgentStateStorage, {BrowserAgentStateStorageOptionsSchema,} from "./BrowserAgentStateStorage.js";
import packageJSON from "./package.json" with {type: "json"};

const packageConfigSchema = z.object({
  checkpoint: CheckpointPluginConfigSchema,
});

export default {
	name: packageJSON.name,
	version: packageJSON.version,
	description: packageJSON.description,
  install(app, config) {
    if (config.checkpoint) {
			app.services
				.waitForItemByType(AgentCheckpointService, (checkpointService) => {
          for (const name in config.checkpoint.providers) {
            const provider = config.checkpoint.providers[name];
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
  config: packageConfigSchema
} satisfies TokenRingPlugin<typeof packageConfigSchema>;