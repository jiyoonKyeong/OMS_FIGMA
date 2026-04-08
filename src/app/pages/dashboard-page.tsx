import { DataTable } from '../components/data-table';
import { InventoryChart } from '../components/inventory-chart';
import { StatCards } from '../components/stat-cards';

const notificationData = [
  { no: '114', date: 'Jan/22/2026', notification: 'Pick-up Schedule Confirmed : P/O No. 202601004   CTP-47  Lot 39488448 (New)' },
  { no: '113', date: 'Jan/21/2026', notification: '견적요청 공정 시작 (New)' },
  { no: '112', date: 'Jan/18/2026', notification: 'Pick-up Schedule Confirmed : P/O No. 202512013   CTP-39  Lot 39489491' },
  { no: '111', date: 'Jan/09/2026', notification: 'Deviation Occurred : P/O No. 202601001   CTP-47  Lot 39489432' },
  { no: '110', date: 'Jan/09/2026', notification: 'Pick-up Schedule Confirmed : P/O No. 202511033   CTP-41  Lot 39488321' },
  { no: '109', date: 'Jan/03/2026', notification: '공정 시작 : 발주 기준일은 가격정보 변경시작 공지' },
  { no: '108', date: 'Jan/03/2026', notification: 'Deviation Occurred : P/O No. 202510401   CTP-36  Lot 39489301' },
];

const deviationData = [
  { no: '19', process: 'Charge',   productName: 'CT-P39 150mg',    batchNo: '5LAP22',   pNo: '4S00068840', deviationDate: 'Jan/22/2026', status: 'In Progress' },
  { no: '18', process: 'Charge',   productName: '유글리마 40mg',    batchNo: '5LAP22T1', pNo: '4S00067172', deviationDate: 'Jan/21/2026', status: 'Closed' },
  { no: '18', process: 'Assembly', productName: '유글리마 40mg',    batchNo: '5M5P24T1', pNo: '4S00067188', deviationDate: 'Jan/18/2026', status: 'Closed' },
  { no: '17', process: 'Assembly', productName: '유글리마 40mg',    batchNo: '5B4P14T1', pNo: '4S00068625', deviationDate: 'Jan/09/2026', status: 'Closed' },
  { no: '16', process: 'Assembly', productName: '필아마 120mg 28G', batchNo: '5LJP03',   pNo: '4S00067858', deviationDate: 'Jan/09/2026', status: 'Closed' },
  { no: '15', process: 'Charge',   productName: '유글리마 80mg',    batchNo: '5M5P25',   pNo: '4S00065898', deviationDate: 'Jan/03/2026', status: 'Closed' },
  { no: '14', process: 'L&P',      productName: 'CT-P39 150mg',    batchNo: '5B4P1ST3', pNo: '4S00068841', deviationDate: 'Jan/03/2026', status: 'Closed' },
];

const batchProgressData = [
  { process: 'Charge',   productName: 'CT-P39 150mg',       batchNo: '5LAP22',   pNo: '4S00068840', startDate: 'Jan/22/2026', endDate: 'Jan/25/2026', status: 'In Progress' },
  { process: 'Charge',   productName: '유글리마 40mg',       batchNo: '5LAP22T1', pNo: '4S00067172', startDate: 'Jan/21/2026', endDate: 'Jan/22/2026', status: 'In Progress' },
  { process: 'Assembly', productName: '유글리마 40mg',       batchNo: '5M5P24T1', pNo: '4S00067188', startDate: 'Jan/18/2026', endDate: 'Jan/21/2026', status: 'Deviation' },
  { process: 'Assembly', productName: 'CT-P39 150mg S/Up',  batchNo: '5B4P14T1', pNo: '4S00068625', startDate: 'Jan/09/2026', endDate: 'Jan/18/2026', status: 'In Progress' },
  { process: 'Assembly', productName: '필아마 120mg 28G',    batchNo: '5LJP03',   pNo: '4S00067858', startDate: 'Jan/09/2026', endDate: 'Jan/09/2026', status: 'Finished' },
  { process: 'Charge',   productName: '유글리마 80mg',       batchNo: '5M5P25',   pNo: '4S00065898', startDate: 'Jan/03/2026', endDate: 'Jan/09/2026', status: 'Finished' },
  { process: 'L&P',      productName: 'CT-P39 150mg',       batchNo: '5B4P1ST3', pNo: '4S00068841', startDate: 'Jan/03/2026', endDate: 'Jan/03/2026', status: 'Finished' },
];

export function DashboardPage() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
      {/* KPI Cards */}
      <StatCards />

      {/* Row 1 — Notification + Deviation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <DataTable
          title="Notification"
          columns={[
            { key: 'no', label: 'No', width: '52px', align: 'center' },
            { key: 'date', label: 'Date', width: '104px' },
            { key: 'notification', label: 'Notification' },
          ]}
          data={notificationData}
          actionButton={
            <button style={{
              padding: '5px 14px',
              background: 'var(--brand-primary)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 150ms',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              + 등록
            </button>
          }
        />
        <DataTable
          title="Deviation List"
          columns={[
            { key: 'no', label: 'No', width: '40px', align: 'center' },
            { key: 'process', label: 'Process', width: '80px' },
            { key: 'productName', label: 'Product', width: '120px' },
            { key: 'batchNo', label: 'Batch No.', width: '84px' },
            { key: 'pNo', label: 'P/O No', width: '100px' },
            { key: 'deviationDate', label: 'Date', width: '100px' },
            { key: 'status', label: 'Status', width: '100px', align: 'center' },
          ]}
          data={deviationData}
        />
      </div>

      {/* Row 2 — Batch Schedule + Inventory Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <DataTable
          title="Batch Progress Schedule"
          columns={[
            { key: 'process', label: 'Process', width: '80px' },
            { key: 'productName', label: 'Product', width: '120px' },
            { key: 'batchNo', label: 'Batch No.', width: '84px' },
            { key: 'pNo', label: 'P/O No', width: '100px' },
            { key: 'startDate', label: 'Start', width: '94px' },
            { key: 'endDate', label: 'End', width: '94px' },
            { key: 'status', label: 'Status', width: '100px', align: 'center' },
          ]}
          data={batchProgressData}
        />
        <InventoryChart />
      </div>
    </div>
  );
}