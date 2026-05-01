class ToolRegistry {
  constructor() {
    this.tools = new Map();
  }

  registerTool(tool) {
    this.validateToolDefinition(tool);
    this.tools.set(tool.name, tool);
    return tool;
  }

  getTool(name) {
    return this.tools.get(name);
  }

  validateToolDefinition(tool) {
    if (!tool || typeof tool !== 'object') {
      throw new Error('Tool must be an object.');
    }

    const { name, description, inputSchema, execute } = tool;

    if (!name || typeof name !== 'string') {
      throw new Error('Tool name must be a non-empty string.');
    }

    if (!description || typeof description !== 'string') {
      throw new Error('Tool description must be a non-empty string.');
    }

    if (!inputSchema || typeof inputSchema !== 'object') {
      throw new Error('Tool inputSchema must be an object.');
    }

    if (typeof execute !== 'function') {
      throw new Error('Tool execute must be a function.');
    }
  }

  validateInput(inputSchema, input) {
    const required = Array.isArray(inputSchema.required) ? inputSchema.required : [];
    const properties = inputSchema.properties || {};

    for (const key of required) {
      if (!(key in input)) {
        return { valid: false, error: `Missing required field: ${key}` };
      }
    }

    for (const [key, config] of Object.entries(properties)) {
      if (!(key in input)) {
        continue;
      }

      const expectedType = config.type;
      if (!expectedType) {
        continue;
      }

      const actualType = Array.isArray(input[key]) ? 'array' : typeof input[key];
      if (actualType !== expectedType) {
        return {
          valid: false,
          error: `Invalid type for field '${key}': expected ${expectedType}, got ${actualType}`,
        };
      }
    }

    return { valid: true };
  }
}

module.exports = ToolRegistry;
