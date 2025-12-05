import type { DTOStructure } from 'types/dto.structure';
import * as dtoSchemas from './api';

/**
 *  This file aims to ensure at build time that
 *  all exported API dto schemas satisfy the expected DTO schema structure
 */

const _schemas = dtoSchemas satisfies Record<string, DTOStructure>;
