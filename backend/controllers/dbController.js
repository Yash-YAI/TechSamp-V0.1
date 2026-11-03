import mongoose from 'mongoose';
import config from '../config/env.js';

// Schemas & Factory Functions
import { createUserModel } from '../models/User.js';
import { createRoleManagementModel } from '../models/RoleManagement.js';

/* =========================================================================
   1. MULTI-DATABASE CONNECTION STRINGS
   Supports both process.env.MongoDB_URI_* and standard MONGO_URI_* configs
   ========================================================================= */

// 1. Main User Database Connection (eco_development / ym_eco_board)
const URI_ECO =
  process.env.MongoDB_URI_ym_eco_board ||
  process.env.MONGO_URI_USER ||
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/eco_development';

// 2. Tech & Samp Database Connection (techSamp / ym_ypm)
const URI_YPM =
  process.env.MongoDB_URI_ym_ypm ||
  process.env.MONGO_URI_TECHSAMP ||
  process.env.MONGO_URI_YPM ||
  'mongodb://127.0.0.1:27017/techSamp';

// 3. Production Operations Database Connection (ym_prod)
const URI_PROD =
  process.env.MongoDB_URI_ym_prod ||
  process.env.MONGO_URI_PROD ||
  'mongodb://127.0.0.1:27017/ym_prod';

/* =========================================================================
   2. INITIALIZE MULTI-DATABASE CONNECTIONS
   ========================================================================= */

// A) Main User DB Connection
export const ymEcoConnection = mongoose.createConnection(URI_ECO, {
  serverSelectionTimeoutMS: 5000,
});
ymEcoConnection.on('connected', () => {
  const { host, port, name } = ymEcoConnection;
  console.log(`✅ [DB: Eco/MainUser] Connected to database (${name}) at ${host}:${port}`);
});
ymEcoConnection.on('error', (err) =>
  console.error(`❌ [DB: Eco/MainUser] Connection error:`, err.message)
);

// B) Tech & Samp DB Connection
export const ymYPMConnection = mongoose.createConnection(URI_YPM, {
  serverSelectionTimeoutMS: 5000,
});
ymYPMConnection.on('connected', () => {
  const { host, port, name } = ymYPMConnection;
  console.log(`✅ [DB: Tech&Samp/YPM] Connected to database (${name}) at ${host}:${port}`);
});
ymYPMConnection.on('error', (err) =>
  console.error(`❌ [DB: Tech&Samp/YPM] Connection error:`, err.message)
);

// C) Production Database Connection
export const ymProdConnection = mongoose.createConnection(URI_PROD, {
  serverSelectionTimeoutMS: 5000,
});
ymProdConnection.on('connected', () => {
  const { host, port, name } = ymProdConnection;
  console.log(`✅ [DB: ym_Prod] Connected to database (${name}) at ${host}:${port}`);
});
ymProdConnection.on('error', (err) =>
  console.error(`❌ [DB: ym_Prod] Connection error:`, err.message)
);

/* =========================================================================
   3. SCHEMAS & MODELS BOUND TO SPECIFIC DATABASE CONNECTIONS
   ========================================================================= */

// Flexible schema helper
const createFlexibleSchema = (collectionName, schemaDefinition = {}) => {
  return new mongoose.Schema(schemaDefinition, {
    collection: collectionName,
    strict: false,
    timestamps: true,
  });
};

/* --- Users Collections --- */
// Main Users (Eco DB)
export const UserMain = createUserModel(ymEcoConnection);
export const User = UserMain;

// Prod Users (Prod DB)
export const UserProd = createUserModel(ymProdConnection);

/* --- Role Management (Tech & Samp / YPM DB) --- */
export const RoleManagment = createRoleManagementModel(ymYPMConnection);
export const RoleManagement = RoleManagment;

/* --- Orders & Production (Tech & Samp / YPM DB & Prod DB) --- */
export const DtOrder =
  ymYPMConnection.models.DtOrder ||
  ymYPMConnection.model('DtOrder', createFlexibleSchema('dt_orders'));

export const DtOrderProd =
  ymProdConnection.models.DtOrderProd ||
  ymProdConnection.model('DtOrderProd', createFlexibleSchema('dt_orders'));

export const MeasurmentSpec =
  ymYPMConnection.models.MeasurmentSpec ||
  ymYPMConnection.model('MeasurmentSpec', createFlexibleSchema('measurment_specs'));

export const ProductionOrder =
  ymYPMConnection.models.ProductionOrder ||
  ymYPMConnection.model('ProductionOrder', createFlexibleSchema('production_orders'));

export const YorksysOrders =
  ymProdConnection.models.YorksysOrders ||
  ymProdConnection.model('YorksysOrders', createFlexibleSchema('yorksys_orders'));

/* --- Tech & Samp / YDT Operational Models --- */
export const TechPack =
  ymYPMConnection.models.TechPack ||
  ymYPMConnection.model('TechPack', createFlexibleSchema('tech_packs'));

export const LegacyTechPack =
  ymYPMConnection.models.LegacyTechPack ||
  ymYPMConnection.model('LegacyTechPack', createFlexibleSchema('Tech_Pack_Legacy'));

export const ProductionImage =
  ymYPMConnection.models.ProductionImage ||
  ymYPMConnection.model('ProductionImage', createFlexibleSchema('production_images'));

export const ColorBank =
  ymYPMConnection.models.ColorBank ||
  ymYPMConnection.model('ColorBank', createFlexibleSchema('color_banks'));

export const ThreadConsumption =
  ymYPMConnection.models.ThreadConsumption ||
  ymYPMConnection.model('ThreadConsumption', createFlexibleSchema('thread_consumptions'));

export const ProcessSheet =
  ymYPMConnection.models.ProcessSheet ||
  ymYPMConnection.model('ProcessSheet', createFlexibleSchema('process_sheets'));

export const TranslationDictionary =
  ymYPMConnection.models.TranslationDictionary ||
  ymYPMConnection.model('TranslationDictionary', createFlexibleSchema('translation_dictionaries'));

/* =========================================================================
   4. CONNECTION LIFECYCLE MANAGEMENT (Start, Stop, Health Check)
   ========================================================================= */

/**
 * Disconnect all MongoDB database connections cleanly
 */
export async function disconnectMongoDB() {
  try {
    await Promise.allSettled([
      ymEcoConnection?.close(),
      ymYPMConnection?.close(),
      ymProdConnection?.close(),
      mongoose.disconnect(),
    ]);
    console.log('✅ All MongoDB multi-database connections closed.');
  } catch (error) {
    console.error('❌ Error disconnecting MongoDB:', error);
  }
}

/**
 * HTTP Controller: Return the real-time health and status of all database connections
 */
export const getDatabaseStatus = async (req, res) => {
  const getStatusText = (readyState) => {
    switch (readyState) {
      case 0:
        return 'disconnected';
      case 1:
        return 'connected';
      case 2:
        return 'connecting';
      case 3:
        return 'disconnecting';
      default:
        return 'unknown';
    }
  };

  const status = {
    mainUserDatabase: {
      name: ymEcoConnection.name || 'eco_development',
      status: getStatusText(ymEcoConnection.readyState),
      host: ymEcoConnection.host || '127.0.0.1',
      port: ymEcoConnection.port || 27017,
      isReady: ymEcoConnection.readyState === 1,
    },
    techSampDatabase: {
      name: ymYPMConnection.name || 'techSamp',
      status: getStatusText(ymYPMConnection.readyState),
      host: ymYPMConnection.host || '127.0.0.1',
      port: ymYPMConnection.port || 27017,
      isReady: ymYPMConnection.readyState === 1,
    },
    prodDatabase: {
      name: ymProdConnection.name || 'ym_prod',
      status: getStatusText(ymProdConnection.readyState),
      host: ymProdConnection.host || '127.0.0.1',
      port: ymProdConnection.port || 27017,
      isReady: ymProdConnection.readyState === 1,
    },
    timestamp: new Date().toISOString(),
  };

  const allConnected =
    ymEcoConnection.readyState === 1 && ymYPMConnection.readyState === 1;

  return res.status(200).json({
    success: true,
    allConnected,
    databases: status,
  });
};

export default {
  ymEcoConnection,
  ymYPMConnection,
  ymProdConnection,
  UserMain,
  UserProd,
  RoleManagment,
  DtOrder,
  DtOrderProd,
  MeasurmentSpec,
  ProductionOrder,
  YorksysOrders,
  TechPack,
  ColorBank,
  ThreadConsumption,
  ProcessSheet,
  TranslationDictionary,
  disconnectMongoDB,
  getDatabaseStatus,
};

