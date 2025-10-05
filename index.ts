import { AgentTeam, TokenRingPackage } from "@tokenring-ai/agent";
import { CheckpointPackageConfigSchema } from "@tokenring-ai/checkpoint";
import AgentCheckpointService from "@tokenring-ai/checkpoint/AgentCheckpointService";
import BrowserAgentStateStorage, {
	BrowserAgentStateStorageOptionsSchema,
} from "./BrowserAgentStateStorage.js";
import packageJSON from "./package.json" with { type: "json" };

export { default as BrowserAgentStateStorage } from "./BrowserAgentStateStorage.ts";

export const packageInfo: TokenRingPackage = {
	name: packageJSON.name,
	version: packageJSON.version,
	description: packageJSON.description,
	install(agentTeam: AgentTeam) {
		const config = agentTeam.getConfigSlice(
			"checkpoint",
			CheckpointPackageConfigSchema,
		);

		if (config) {
			agentTeam.services
				.waitForItemByType(AgentCheckpointService)
				.then((checkpointService) => {
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
};
