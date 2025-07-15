// src/utils/responseBuilder.ts

interface UpdateResponsePayload {
  message: string;
  found: boolean;
  changedFiles: string[];
  replacements: number;
}

interface ErrorResponsePayload {
  error: string;
}

const ResponseBuilder = {
  ok(changedFiles: string[], replacements: number): UpdateResponsePayload {
    return {
      message: 'Image version updated successfully.',
      found: true,
      changedFiles,
      replacements,
    };
  },

  notChanged(): UpdateResponsePayload {
    return {
      message: 'Matching images found, but no changes were necessary.',
      found: true,
      changedFiles: [],
      replacements: 0,
    };
  },

  notFound(): UpdateResponsePayload {
    return {
      message: 'No matching images found in any YAML files.',
      found: false,
      changedFiles: [],
      replacements: 0,
    };
  },

  badRequest(reason: string): ErrorResponsePayload {
    return {
      error: `Bad request: ${reason}`,
    };
  },

  error(message: string): ErrorResponsePayload {
    return {
      error: message,
    };
  },
};

export default ResponseBuilder;
