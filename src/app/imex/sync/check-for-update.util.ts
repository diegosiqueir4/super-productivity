export enum UpdateCheckResult {
  InSync = 'InSync',
  LocalUpdateRequired = 'LocalUpdateRequired',
  RemoteUpdateRequired = 'RemoteUpdateRequired',
  DataDiverged = 'DataDiverged',
  RemoteNotUpToDateDespiteSync = 'RemoteNotUpToDateDespiteSync',
  LastSyncNotUpToDate = 'LastSyncNotUpToDate',
  ErrorLastSyncNewerThanLocal = 'ErrorLastSyncNewerThanLocal',
  ErrorInvalidTimeValues = 'ErrorInvalidTimeValues',
}

export const checkForUpdate = (params: { remote: number, local: number, lastSync: number }) => {
  _logHelper(params);
  const {remote, local, lastSync} = params;
  const n = Date.now();

  if (remote > n || local > n || lastSync > n) {
    alert('Sync Error: One of the dates provided is from the future...');
    return UpdateCheckResult.ErrorInvalidTimeValues;
  }

  if (lastSync > local) {
    console.error('This should not happen. lastSyncTo > local');
    alert('Sync Error: last sync value is newer than local, which should never happen if you weren`t manually manipulating the data!');
    return UpdateCheckResult.ErrorLastSyncNewerThanLocal;
  }

  if (local === remote) {
    if (local === lastSync) {
      return UpdateCheckResult.InSync;
    } else {
      return UpdateCheckResult.LastSyncNotUpToDate;
    }
  } else if (local > remote) {
    if (lastSync < remote) {
      console.log('DATA DIVERGED: local > remote');
      return UpdateCheckResult.DataDiverged;
    } else if (lastSync < local) {
      return UpdateCheckResult.RemoteUpdateRequired;
    } else if (lastSync === local) {
      alert('Sync Warning: Dropbox date not up to date despite seemingly successful sync');
      return UpdateCheckResult.RemoteNotUpToDateDespiteSync;
    }
  } else if (local < remote) {
    if (lastSync !== local) {
      console.log('DATA DIVERGED: local < remote');
      return UpdateCheckResult.DataDiverged;
    } else {
      return UpdateCheckResult.LocalUpdateRequired;
    }
  }

  throw new Error('Inconclusive state. This should not happen');
};


const _logHelper = (params: { remote: number, local: number, lastSync: number }) => {
  console.log(params);
  const oldestFirst = Object.keys(params).sort((k1, k2) => params[k1] - params[k2]);
  const keyOfOldest = oldestFirst[0];
  const zeroed = oldestFirst.reduce((acc, key) =>
      ({
        ...acc,
        [key]: (params[key] - params[keyOfOldest]) / 1000,
      }),
    {});
  console.log(zeroed, (Date.now() - params[keyOfOldest]) / 1000);
};
