export type BucketStep = {
  id: string;
  text: string;
  done: boolean;
  readOnly?: boolean;
};

/** Keep lived legacy evidence, without reviving generated chains. */
export function visibleBucketSteps(
  rows: Array<{ id: string; questId: string; type: string; title: string; status: string }>
): BucketStep[] {
  return rows.flatMap((row) => {
    if (row.type === 'bucket-step') {
      return [{ id: row.id, text: row.title, done: row.status === 'completed' }];
    }
    if (row.questId.startsWith('bc-') && row.status === 'completed') {
      return [{ id: row.id, text: row.title, done: true, readOnly: true }];
    }
    return [];
  });
}
