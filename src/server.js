const express = require('express');
const ToolRegistry = require('./toolRegistry');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const registry = new ToolRegistry();

registry.registerTool({
  name: 'echo',
  description: 'Echoes the message back',
  inputSchema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
    required: ['message'],
  },
  execute: async (input) => ({
    message: input.message,
  }),
});

app.post('/tools/register', async (req, res) => {
  try {
    const { name, description, inputSchema } = req.body;

    const tool = {
      name,
      description,
      inputSchema,
      execute: async (input) => ({
        ok: true,
        input,
      }),
    };

    registry.registerTool(tool);

    return res.status(201).json({
      success: true,
      tool: {
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

app.post('/tools/execute', async (req, res) => {
  const { name, input } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Tool name is required and must be a string.',
    });
  }

  const safeInput = input && typeof input === 'object' ? input : {};
  const tool = registry.getTool(name);

  if (!tool) {
    return res.status(404).json({
      success: false,
      error: `Tool '${name}' not found.`,
    });
  }

  const validation = registry.validateInput(tool.inputSchema, safeInput);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.error,
    });
  }

  try {
    const output = await tool.execute(safeInput);
    return res.status(200).json({
      success: true,
      tool: name,
      output,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.use((err, _req, res, _next) => {
  return res.status(400).json({
    success: false,
    error: err.message || 'Invalid JSON payload.',
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`MCP runtime listening on port ${port}`);
});
