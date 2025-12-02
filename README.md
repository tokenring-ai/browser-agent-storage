# @tokenring-ai/browser-agent-storage

Browser-based agent state storage for the TokenRing ecosystem.

This package provides a browser-local storage implementation for agent state checkpoints using `localStorage`. It serves as a persistent storage provider for agent checkpoints in client-side applications.

## Features

- **Browser-based storage**: Uses `localStorage` for persistent agent state storage
- **Checkpoint management**: Create, retrieve, list, and delete agent checkpoints
- **Agent-specific isolation**: Supports multiple agents with proper namespace separation
- **Plugin integration**: Integrates seamlessly with the TokenRing application framework
- **Type-safe**: Full TypeScript support with Zod validation for configuration

## When to use this package

Use this package when building client-side applications that need to persist agent state checkpoints in the browser. It's ideal for:
- Web applications requiring local agent state persistence
- Development and testing environments
- Client-side agents that need to maintain state between sessions
- Applications where server-side storage is not available or desired

## Installation

This package is part of the TokenRing monorepo and can be consumed as a workspace dependency. In an external project, you would install it via npm:

```bash
npm install @tokenring-ai/browser-agent-storage
```

## Quick start

### Basic Usage

```ts
import BrowserAgentStateStorage from "@tokenring-ai/browser-agent-storage";

// Create a storage instance with custom prefix
const storage = new BrowserAgentStateStorage({
  storageKeyPrefix: "myApp_agentState_"
});

// Store a checkpoint
const checkpoint = {
  agentId: "agent-123",
  name: "After processing step 1",
  state: { currentStep: 1, data: { foo: "bar" } },
  createdAt: Date.now()
};

const checkpointId = await storage.storeCheckpoint(checkpoint);
console.log(`Checkpoint stored with ID: ${checkpointId}`);

// Retrieve the checkpoint
const retrieved = await storage.retrieveCheckpoint(checkpointId);
console.log("Retrieved checkpoint:", retrieved);

// List all checkpoints
const allCheckpoints = await storage.listCheckpoints();
console.log("All checkpoints:", allCheckpoints);

// Delete a specific checkpoint
const deleted = await storage.deleteCheckpoint(checkpointId);
console.log(`Checkpoint deleted: ${deleted}`);

// Clear all checkpoints
await storage.clearAllCheckpoints();
```

### Plugin Integration

When used as a plugin in the TokenRing application framework:

```ts
import TokenRingApp from "@tokenring-ai/app";
import browserAgentStorage from "@tokenring-ai/browser-agent-storage";

const app = new TokenRingApp({
  // ... app configuration
});

// Register the plugin
app.use(browserAgentStorage);

// The plugin will automatically register browser storage providers
// based on the checkpoint package configuration
```

## API Reference

### BrowserAgentStateStorage

A browser-based implementation of `AgentCheckpointProvider` that uses `localStorage` for persistent storage.

#### Constructor

```ts
new BrowserAgentStateStorage(options: BrowserAgentStateStorageOptions)
```

**Parameters:**
- `options.storageKeyPrefix` (optional, default: `"tokenRingAgentState_v1_"`) - Prefix for localStorage keys to achieve isolation

#### Methods

##### `storeCheckpoint(checkpoint: NamedAgentCheckpoint): Promise<string>`

Stores a new checkpoint for an agent.

**Parameters:**
- `checkpoint`: `NamedAgentCheckpoint` - The checkpoint to store

**Returns:** `Promise<string>` - The ID of the stored checkpoint

**Example:**
```ts
const checkpointId = await storage.storeCheckpoint({
  agentId: "agent-123",
  name: "Processing complete",
  state: { step: 5, result: "success" },
  createdAt: Date.now()
});
```

##### `retrieveCheckpoint(checkpointId: string): Promise<StoredAgentCheckpoint | null>`

Retrieves a checkpoint by its ID.

**Parameters:**
- `checkpointId`: `string` - The checkpoint identifier

**Returns:** `Promise<StoredAgentCheckpoint | null>` - The retrieved checkpoint or null if not found

**Example:**
```ts
const checkpoint = await storage.retrieveCheckpoint("agent-123_1700000000000");
```

##### `listCheckpoints(): Promise<AgentCheckpointListItem[]>`

Lists all checkpoints ordered by creation time (newest first).

**Returns:** `Promise<AgentCheckpointListItem[]>` - Array of checkpoint list items

**Example:**
```ts
const checkpoints = await storage.listCheckpoints();
console.log(checkpoints.map(cp => ({
  id: cp.id,
  name: cp.name,
  agentId: cp.agentId,
  createdAt: new Date(cp.createdAt).toISOString()
})));
```

##### `deleteCheckpoint(checkpointId: string): Promise<boolean>`

Deletes a specific checkpoint by ID.

**Parameters:**
- `checkpointId`: `string` - The checkpoint identifier to delete

**Returns:** `Promise<boolean>` - True if checkpoint was deleted, false if not found

**Example:**
```ts
const deleted = await storage.deleteCheckpoint("agent-123_1700000000000");
console.log(`Checkpoint deleted: ${deleted}`);
```

##### `clearAllCheckpoints(): Promise<void>`

Clears all checkpoints from storage.

**Returns:** `Promise<void>`

**Example:**
```ts
await storage.clearAllCheckpoints();
```

##### `close(): void`

Closes any resources used by the service. No-op for browser implementation as localStorage doesn't require explicit closing.

**Returns:** `void`

**Example:**
```ts
storage.close();
```

## Configuration

### BrowserAgentStateStorageOptions

```ts
interface BrowserAgentStateStorageOptions {
  storageKeyPrefix?: string;
}
```

**Default storage key prefix:** `"tokenRingAgentState_v1_"`

**Storage key format:** `{storageKeyPrefix}checkpoints`

### Plugin Configuration

When using the plugin, configure it in your TokenRing app's checkpoint package configuration:

```json
{
  "checkpoint": {
    "providers": {
      "myBrowserStorage": {
        "type": "browser",
        "storageKeyPrefix": "myApp_"
      }
    }
  }
}
```

## Storage Details

### localStorage Usage

The package uses `localStorage` for persistence:

- **Storage key**: `{storageKeyPrefix}checkpoints`
- **Data format**: JSON array of `StoredAgentCheckpoint` objects
- **Storage structure**:
  ```typescript
  [
    {
      id: "agentId_timestamp",
      agentId: "agent-123",
      name: "Checkpoint name",
      state: { /* agent state */ },
      createdAt: 1700000000000
    }
  ]
  ```

### Browser Compatibility

- **Modern browsers**: Chrome, Firefox, Safari, Edge (localStorage support)
- **Storage limits**: Typically ~5MB per origin (varies by browser)
- **Same-origin policy**: Data is scoped to the specific origin/domain

### Browser-Specific Features

- **Automatic persistence**: Data persists across browser sessions
- **No server dependency**: Works entirely client-side
- **Immediate access**: Synchronous localStorage operations with async wrapper

## Limitations

- **Storage capacity**: Limited by browser localStorage size (typically ~5MB per origin)
- **Data scope**: Tied to specific browser and origin; no cross-device sync
- **No backup**: No server-side backup or multi-user collaboration
- **Privacy considerations**: Data persists until explicitly cleared by user or application
- **Quota limits**: May hit storage limits in applications with large state data

## Error Handling

The package includes error handling for common scenarios:

- **localStorage errors**: Caught and logged to console
- **JSON parsing errors**: Handled gracefully with fallback to empty array
- **Invalid checkpoint IDs**: Returns null for non-existent checkpoints

## TypeScript Support

This package is authored in TypeScript and provides full type definitions:

- Import types from `@tokenring-ai/checkpoint/AgentCheckpointProvider`
- Configuration validation using Zod schemas
- Strong typing for all API methods and return values

## Development

### Building

```bash
# Build the package
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Testing

The package includes comprehensive test coverage for all functionality.

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## Support

For issues and questions:
- Check the [GitHub Issues](https://github.com/your-repo/issues)
- Review the [TokenRing documentation](https://docs.tokenring.ai)
- Join the [community discussions](https://github.com/your-repo/discussions)