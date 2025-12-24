# Browser Agent Storage

Provides browser-based agent state storage for the TokenRing ecosystem using localStorage for persistent checkpoint management.

## Overview/Purpose

The Browser Agent Storage package implements a browser-based storage provider for TokenRing AI agents, providing persistent state management through the browser's localStorage API. This implementation enables agents to store and retrieve their state checkpoints locally within the browser environment.

### Key Features

- **Browser-based Storage**: Uses localStorage for persistent agent state storage
- **Checkpoint Management**: Full CRUD operations for agent state checkpoints
- **TokenRing Integration**: Seamlessly integrates with the TokenRing checkpoint system
- **Agent-specific Storage**: Maintains isolated storage per agent with configurable prefixes
- **Cross-platform Compatibility**: Works across all modern browsers supporting localStorage
- **Type-safe Implementation**: Full TypeScript support with Zod schema validation
- **Error Handling**: Graceful handling of storage errors and data corruption
- **Performance Optimization**: Efficient storage and retrieval operations

## Installation

```bash
bun install @tokenring-ai/browser-agent-storage
```

## Package Structure

```
pkg/browser-agent-storage/
├── BrowserAgentStateStorage.ts    # Core storage implementation
├── BrowserAgentStateStorage.test.ts # Unit tests
├── integration.test.ts           # Integration tests
├── plugin.ts                     # TokenRing plugin integration
├── index.ts                      # Module exports
├── package.json                  # Package configuration
├── vitest.config.ts             # Test configuration
└── README.md                     # This documentation
```

## Core Components

### BrowserAgentStateStorage

The main storage class that implements the `AgentCheckpointProvider` interface for browser-based storage:

```typescript
import { BrowserAgentStateStorage } from '@tokenring-ai/browser-agent-storage';

const storage = new BrowserAgentStateStorage({
  storageKeyPrefix: 'myApp_', // Optional custom prefix
});
```

#### Constructor Options

- `storageKeyPrefix` (string, optional): Custom prefix for localStorage keys. Defaults to `tokenRingAgentState_v1_`

#### Storage Structure

Checkpoints are stored in localStorage under the key: `{prefix}checkpoints`

Each checkpoint contains:
- `id`: Unique identifier generated using UUID
- `agentId`: The agent identifier
- `name`: Checkpoint name
- `config`: Agent configuration at checkpoint time
- `state`: Agent state data
- `createdAt`: Timestamp of checkpoint creation

## Usage Examples

### Basic Storage Operations

```typescript
import { BrowserAgentStateStorage } from '@tokenring-ai/browser-agent-storage';

// Initialize storage with default prefix
const storage = new BrowserAgentStateStorage({});

// Create a checkpoint
const checkpoint = {
  agentId: 'agent-123',
  name: 'initial-state',
  config: { model: 'gpt-4', temperature: 0.7 },
  state: { messages: [], context: {} },
  createdAt: Date.now(),
};

const checkpointId = await storage.storeCheckpoint(checkpoint);
console.log('Stored checkpoint:', checkpointId);

// Retrieve a checkpoint
const retrieved = await storage.retrieveCheckpoint(checkpointId);
console.log('Retrieved checkpoint:', retrieved);

// List all checkpoints (newest first)
const allCheckpoints = await storage.listCheckpoints();
console.log('All checkpoints:', allCheckpoints);

// Delete a specific checkpoint
const deleted = await storage.deleteCheckpoint(checkpointId);
console.log('Deleted:', deleted);
```

### Custom Storage Prefix

```typescript
import { BrowserAgentStateStorage } from '@tokenring-ai/browser-agent-storage';

// Use custom prefix for isolation between applications
const storage = new BrowserAgentStateStorage({
  storageKeyPrefix: 'myapp_v2_',
});

// This will store data under keys starting with 'myapp_v2_'
```

### Integration with TokenRing

The package automatically integrates with TokenRing through the checkpoint plugin system:

```typescript
// In your TokenRing app configuration
const app = new TokenRingApp({
  checkpoint: {
    providers: {
      browser: {
        type: "browser",
        storageKeyPrefix: "myapp_"
      }
    }
  }
});

// The BrowserAgentStateStorage will be automatically registered
```

### Real-world Development Workflow

```typescript
import { BrowserAgentStateStorage } from '@tokenring-ai/browser-agent-storage';

const storage = new BrowserAgentStateStorage({});

// Simulate a typical development workflow
const initialCheckpoint: NamedAgentCheckpoint = {
  agentId: 'dev-agent-001',
  name: 'initial-development',
  config: { model: 'gpt-4', temperature: 0.7 },
  state: { messages: [], context: { project: 'todo-app' } },
  createdAt: Date.now() - 3600000,
};

const featureCheckpoint: NamedAgentCheckpoint = {
  agentId: 'dev-agent-001',
  name: 'feature-implementation',
  config: { model: 'gpt-4', temperature: 0.8 },
  state: { 
    messages: [{ role: 'user', content: 'Implement todo feature' }],
    context: { project: 'todo-app', phase: 'feature-development' }
  },
  createdAt: Date.now() - 1800000,
};

// Store checkpoints
await storage.storeCheckpoint(initialCheckpoint);
await storage.storeCheckpoint(featureCheckpoint);

// List checkpoints (newest first)
const checkpoints = await storage.listCheckpoints();
console.log('Development checkpoints:', checkpoints);
```

## API Reference

### BrowserAgentStateStorage

#### Properties

- `name`: Storage provider name ("BrowserAgentStateStorage")
- `storageKeyPrefix`: Configured prefix for localStorage keys

#### Methods

##### storeCheckpoint(checkpoint)

Stores a new checkpoint for an agent.

**Parameters:**
- `checkpoint` (NamedAgentCheckpoint): Checkpoint data including agentId, name, config, state, and createdAt

**Returns:** `Promise<string>` - The ID of the stored checkpoint

##### retrieveCheckpoint(checkpointId)

Retrieves a checkpoint by its ID.

**Parameters:**
- `checkpointId` (string): The checkpoint identifier

**Returns:** `Promise<StoredAgentCheckpoint | null>` - The retrieved checkpoint or null if not found

##### listCheckpoints()

Lists all stored checkpoints ordered by creation time (newest first).

**Returns:** `Promise<AgentCheckpointListItem[]>` - Array of checkpoint list items

##### deleteCheckpoint(checkpointId)

Deletes a specific checkpoint by ID.

**Parameters:**
- `checkpointId` (string): The checkpoint identifier to delete

**Returns:** `Promise<boolean>` - True if checkpoint was deleted, false if not found

##### clearAllCheckpoints()

Clears all checkpoints from storage.

**Returns:** `Promise<void>`

##### close()

Closes any resources used by the service. No-op for browser implementation.

**Returns:** `void`

## Configuration

### BrowserAgentStateStorageOptions

```typescript
{
  storageKeyPrefix?: string; // Optional, defaults to "tokenRingAgentState_v1_"
}
```

### TokenRing Integration

Configure in your TokenRing app:

```typescript
{
  checkpoint: {
    providers: {
      browser: {
        type: "browser",
        storageKeyPrefix: "custom_prefix_" // Optional custom prefix
      }
    }
  }
}
```

## Dependencies

- **@tokenring-ai/agent**: Agent framework and state management
- **@tokenring-ai/app**: TokenRing application framework
- **@tokenring-ai/checkpoint**: Checkpoint management system
- **zod**: Runtime type validation and schema definition
- **uuid**: UUID generation for checkpoint IDs

## Development

### Testing

The package includes Vitest configuration for testing:

```bash
vitest run
```

```bash
bun run test:coverage
```

### Building

```bash
bun run build
```

## Version History

- **v0.2.0**: Initial release with full checkpoint management
- Browser localStorage implementation
- Plugin system integration
- TypeScript and Zod validation
- Comprehensive test suite

## License

MIT License - see package.json for details.
