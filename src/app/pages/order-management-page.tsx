import { useCallback, useRef, useState } from 'react';
import {
  Search, Download, Upload, Save,
  SlidersHorizontal, ChevronDown, X, RotateCcw,
  ChevronLeft, ChevronRight as ChevronRightIcon,
  Paperclip, FileText, Trash2, CloudUpload, File, ZoomIn,
} from 'lucide-react';
import { useTheme } from '../contexts/theme-context';
import { useNavigate, useLocation } from 'react-router';

/* ── 라우트 그룹별 탭 정의 — 사이드바와 동일 ─────────── */
const PLAN_TABS = [
  { label: '충전/AI FCST',        path: '/plan/ai-fcst' },
  { label: '조립/포장 FCST',      path: '/plan/assembly-fcst' },
  { label: '조립/포장 요약 FCST', path: '/plan/assembly-summary' },
  { label: 'L&P FCST',            path: '/plan/lp-fcst' },
  { label: 'L&P 요약 FCST',       path: '/plan/lp-summary' },
  { label: 'PO 관리',             path: '/plan/po' },
];
const SUPPLY_TABS = [
  { label: '충전/조립 공급계획',   path: '/supply/ai' },
  { label: '조립/포장 공급계획', path: '/supply/assembly' },
  { label: 'L&P 공급계획',       path: '/supply/lp' },
];
const REPORT_TABS = [
  { label: 'FCST 대비 공급 레포트', path: '/report/supply' },
  { label: '충전/AI Status',         path: '/report/ai' },
  { label: '조립/포장 Status',       path: '/report/assembly' },
  { label: '재고현황',                path: '/report/ds' },
];
// /order-management 전용 로컬 탭 (라우트 없음)
const ORDER_LOCAL_TABS = [
  '출입/AI FCST', '출입/출품 구분 FCST', '출입/출품 과년 FCST', 'L&P FCST',
];

/** 현재 경로에 맞는 탭 목록 반환 */
function resolveTabGroup(pathname: string) {
  if (pathname.startsWith('/plan/'))   return { type: 'route', tabs: PLAN_TABS };
  if (pathname.startsWith('/supply/')) return { type: 'route', tabs: SUPPLY_TABS };
  if (pathname.startsWith('/report/')) return { type: 'route', tabs: REPORT_TABS };
  return { type: 'local', tabs: ORDER_LOCAL_TABS };
}

/* ── Types ─────────────────────────────────────────── */
type TableRow = {
  fcstId: string; product: string; 제형: string; 국가: string; pack: string;
  상세공정: string; qtyEqualTyping: string; qtyPackH: number; qtyPackL: number;
  expectedDate: string; desiredDelivery: string; binding: string;
  adpAllocation: string; 기준시점: string; allocationId: string;
  대응기반: string; 비고: string;
};

type LpFcstRow = {
  product: string;
  제형: string;
  국가: string;
  pack: string;
  qtyVialSyringe: string;
  qtyPack: string;
  expectedLpDate: string;
  desiredDeliveryDate: string;
  binding: string;
  udpAllocation: string;
  가용시점: string;
  allocationId: string;
  긴급도QpRelease: string;
  비고: string;
};

type LpSummaryRow = {
  product: string;
  제형: string;
  국가: string;
  pack: string;
  cells: { v: number | null }[];
};

type SupplyAiRow = {
  process: string;
  product: string;
  batchSize: string;
  fullEnd: number;
  semiEnd: number;
  cells: { v: number | null }[];
};

type SupplyAssemblyRow = {
  product: string;
  formulation: string;
  country: string;
  pack: string;
  step: string;
  fullEnd: number;
  semiEnd: number;
  cells: { v: number | null }[];
};

type ReportAssemblyRow = {
  process: string;
  product: string;
  batchNo: string;
  formulation: string;
  country: string;
  pack: string;
  step: string;
  dueDate: string;
  requestDate: string;
  poNo: string;
  qty: string;
  shipQty: string;
  startDate: string;
  endDate: string;
  coaComp: string;
  shipPacket: string;
  shipDate: string;
  deviation: string;
  dsTrace: string;
  memo: string;
  dsLots: { process: string; product: string; batchNo: string; dsLot: string }[];
};

type ReportDsRow = {
  type: string;
  product: string;
  batchNo: string;
  formulation: string;
  country: string;
  pack: string;
  qty: string;
  receiptDate: string;
  agingDays: string;
  obsolete: string;
};

/** 조립/포장 요약 FCST (/plan/assembly-summary) 전용 행 */
type AssemblyFcstRow = {
  product: string;
  제형: string;
  국가: string;
  pack: string;
  상세공정: string;
  fullEnd: number;
  semiEnd: number;
  cells: { v: number | null }[];
};

type ColumnDef = { key: string; label: string; width?: number; pin?: boolean };

const ASSEMBLY_MONTHS = [
  '25년 11월', '25년 12월',
  '26년 1월', '26년 2월', '26년 3월', '26년 4월',
  '26년 5월', '26년 6월', '26년 7월', '26년 8월',
  '26년 9월', '26년 10월', '26년 11월',
];

const BG_FULL_L = '#d6edd9';
const BG_SEMI_L = '#fdf3c8';
const BG_FULL_D = '#0d2e1a';
const BG_SEMI_D = '#29270a';

const n = (val: number) => ({ v: val });
const __ = () => ({ v: null });

function getAssemblyCellBg(ci: number, row: { fullEnd: number; semiEnd: number }, isDark: boolean) {
  const full = isDark ? BG_FULL_D : BG_FULL_L;
  const semi = isDark ? BG_SEMI_D : BG_SEMI_L;
  if (ci <= row.fullEnd) return full;
  if (ci <= row.semiEnd) return semi;
  return 'transparent';
}

function fmt(v: number) {
  return v.toLocaleString('ko-KR');
}

const assemblyFcstMockCore: AssemblyFcstRow[] = [
  {
    product: 'CT-P13 120mg',
    제형: 'AI',
    국가: 'CA',
    pack: '1',
    상세공정: '라벨링',
    fullEnd: 2,
    semiEnd: 3,
    cells: [n(250000), n(250000), n(250000), n(200000), __(), __(), __(), __(), __(), __(), __(), __(), __()],
  },
  {
    product: 'CT-P13 120mg',
    제형: 'AI',
    국가: 'AU',
    pack: '1',
    상세공정: '카토닝',
    fullEnd: 1,
    semiEnd: 3,
    cells: [n(250000), n(100000), __(), __(), __(), __(), __(), __(), n(100000), n(500000), __(), __(), __()],
  },
  {
    product: 'CT-P13 120mg',
    제형: 'PFS',
    국가: 'TR',
    pack: '2',
    상세공정: '조립/라벨 카토닝',
    fullEnd: 3,
    semiEnd: 4,
    cells: [__(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __()],
  },
  {
    product: 'CT-P13 120mg',
    제형: 'PFS',
    국가: 'KR',
    pack: '2',
    상세공정: '외부카토닝',
    fullEnd: 2,
    semiEnd: 4,
    cells: [__(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __()],
  },
];

const assemblyFcstTableData: AssemblyFcstRow[] = [
  ...assemblyFcstMockCore,
  ...Array.from({ length: 12 }, () => ({
    product: '',
    제형: '',
    국가: '',
    pack: '',
    상세공정: '',
    fullEnd: -1,
    semiEnd: -1,
    cells: ASSEMBLY_MONTHS.map(() => __()),
  })),
];

/* ── Mock data ──────────────────────────────────────── */
const tableData: TableRow[] = Array.from({ length: 20 }, (_, i) => ({
  fcstId:         ['CT-P13 120mg','CT-P13 120mg','CT-P06','CT-P39','CT-P47'][i % 5],
  product:        ['CT-P13 120mg','유글리마 40mg','필아마 120mg','CT-P39 150mg','CT-P47'][i % 5],
  제형:           ['PFS','VIAL','A12-G','PFS','VIAL'][i % 5],
  국가:           ['US','EU','CA','AU','TW'][i % 5],
  pack:           String((i % 4) + 1),
  상세공정:       ['조립/라벨링','Charge','Assembly','L&P','재포장'][i % 5],
  qtyEqualTyping: i % 3 === 0 ? '소진됨' : '',
  qtyPackH:       100 + i * 12,
  qtyPackL:       100 + i * 37,
  expectedDate:   `2026.0${(i % 9) + 1}.01`,
  desiredDelivery:`2026.0${(i % 9) + 1}.15`,
  binding:        ['100%','80%','60%','95%','75%'][i % 5],
  adpAllocation:  i % 4 === 0 ? '소진됨' : i % 4 === 1 ? '재포장' : '-',
  기준시점:       `2025.0${(i % 9) + 1}.21`,
  allocationId:   `ELV10${59 + i}`,
  대응기반:       `2026.0${(i % 9) + 1}.29`,
  비고:           i % 2 === 0 ? '-' : `비고 ${i + 1}`,
}));

const HEADERS: ColumnDef[] = [
  { key: 'fcstId',         label: 'FCST 월',         width: 120, pin: true },
  { key: 'product',        label: 'Product',          width: 150 },
  { key: '제형',           label: '제형',             width: 70  },
  { key: '국가',           label: '국가',             width: 60  },
  { key: 'pack',           label: 'Pack',             width: 55  },
  { key: '상세공정',       label: '상세 공정',        width: 120 },
  { key: 'qtyEqualTyping', label: 'QtyEqualTyping',   width: 120 },
  { key: 'qtyPackH',       label: 'QtyPackH',         width: 90  },
  { key: 'qtyPackL',       label: 'QtyPackL',         width: 90  },
  { key: 'expectedDate',   label: 'Expected L&P',     width: 120 },
  { key: 'desiredDelivery',label: 'Desired Delivery', width: 130 },
  { key: 'binding',        label: 'Binding',          width: 80  },
  { key: 'adpAllocation',  label: 'aDP Allocation',   width: 120 },
  { key: '기준시점',       label: '기준시점',         width: 110 },
  { key: 'allocationId',   label: 'Allocation ID',    width: 110 },
  { key: '대응기반',       label: '대응기반(UP)',      width: 120 },
  { key: '비고',           label: '비고',             width: 90  },
];

const LP_FCST_HEADERS: ColumnDef[] = [
  { key: 'product',            label: 'Product', width: 128, pin: true },
  { key: '제형',               label: '제형', width: 64 },
  { key: '국가',               label: '국가', width: 56 },
  { key: 'pack',               label: 'Pack', width: 52 },
  { key: 'qtyVialSyringe',     label: 'Qty(vial,syringe)', width: 120 },
  { key: 'qtyPack',            label: 'Qty(pack)', width: 84 },
  { key: 'expectedLpDate',     label: 'Expected L&P Date', width: 132 },
  { key: 'desiredDeliveryDate',label: 'Desired Delivery Date', width: 132 },
  { key: 'binding',            label: 'Binding', width: 72 },
  { key: 'udpAllocation',      label: 'uDP Allocation', width: 100 },
  { key: '가용시점',            label: '가용시점', width: 84 },
  { key: 'allocationId',       label: 'Allocation ID', width: 100 },
  { key: '긴급도QpRelease',     label: '긴급도(QP Release)', width: 132 },
  { key: '비고',               label: '비고', width: 110 },
];

const REPORT_ASSEMBLY_HEADERS: ColumnDef[] = [
  { key: 'process',     label: 'Process', width: 66, pin: true },
  { key: 'product',     label: 'Product', width: 138 },
  { key: 'batchNo',     label: 'Batch No', width: 88 },
  { key: 'formulation', label: '제형', width: 54 },
  { key: 'country',     label: '국가', width: 52 },
  { key: 'pack',        label: 'Pack', width: 48 },
  { key: 'step',        label: '공정', width: 84 },
  { key: 'dueDate',     label: '납기 요청 시점', width: 98 },
  { key: 'requestDate', label: '요청일자', width: 90 },
  { key: 'poNo',        label: 'PO No.', width: 96 },
  { key: 'qty',         label: '수량', width: 72 },
  { key: 'shipQty',     label: '출하 수량', width: 78 },
  { key: 'startDate',   label: 'Start Date', width: 86 },
  { key: 'endDate',     label: 'End Date', width: 86 },
  { key: 'coaComp',     label: 'COA Comp.', width: 86 },
  { key: 'shipPacket',  label: '출하패킷전달', width: 92 },
  { key: 'shipDate',    label: '선적일자', width: 90 },
  { key: 'deviation',   label: 'Deviation', width: 78 },
  { key: 'dsTrace',     label: 'DS 추적', width: 64 },
  { key: 'memo',        label: 'Memo', width: 160 },
];

const REPORT_DS_HEADERS: ColumnDef[] = [
  { key: 'type',        label: 'Type', width: 70, pin: true },
  { key: 'product',     label: 'Product', width: 140 },
  { key: 'batchNo',     label: 'Batch No', width: 74 },
  { key: 'formulation', label: '제형', width: 70 },
  { key: 'country',     label: '국가', width: 70 },
  { key: 'pack',        label: 'Pack', width: 70 },
  { key: 'qty',         label: '수량', width: 72 },
  { key: 'receiptDate', label: '입고일자', width: 92 },
  { key: 'agingDays',   label: 'Aging(일)', width: 72 },
  { key: 'obsolete',    label: '불용여부', width: 72 },
];

const LP_FCST_EMPTY: LpFcstRow = {
  product: '',
  제형: '',
  국가: '',
  pack: '',
  qtyVialSyringe: '',
  qtyPack: '',
  expectedLpDate: '',
  desiredDeliveryDate: '',
  binding: '',
  udpAllocation: '',
  가용시점: '',
  allocationId: '',
  긴급도QpRelease: '',
  비고: '',
};

const lpFcstTableData: LpFcstRow[] = [
  {
    product: 'CT-P13 120mg',
    제형: 'AI',
    국가: 'CA',
    pack: '1',
    qtyVialSyringe: '1728',
    qtyPack: '1,728',
    expectedLpDate: '2026-01-01',
    desiredDeliveryDate: '2026-01-01',
    binding: '100%',
    udpAllocation: 'SLOP01',
    가용시점: '2025-07-23',
    allocationId: 'SL101557',
    긴급도QpRelease: '2026-01-29',
    비고: '1/26 선적',
  },
  {
    product: 'CT-P13 120mg',
    제형: 'AI',
    국가: 'AU',
    pack: '1',
    qtyVialSyringe: '500',
    qtyPack: '250',
    expectedLpDate: '2026-01-01',
    desiredDeliveryDate: '2026-01-01',
    binding: '100%',
    udpAllocation: 'SLOP01',
    가용시점: '2025-07-23',
    allocationId: 'SL101557',
    긴급도QpRelease: '2026-01-29',
    비고: '',
  },
  {
    product: 'CT-P13 120mg',
    제형: 'IV',
    국가: 'TR',
    pack: '2',
    qtyVialSyringe: '300',
    qtyPack: '300',
    expectedLpDate: '2026-01-01',
    desiredDeliveryDate: '2026-01-01',
    binding: '100%',
    udpAllocation: 'SLJP01',
    가용시점: '2025-07-23',
    allocationId: 'SL101559',
    긴급도QpRelease: '2026-01-29',
    비고: '',
  },
  {
    product: 'CT-P13 120mg',
    제형: 'IV',
    국가: 'KR',
    pack: '2',
    qtyVialSyringe: '2793',
    qtyPack: '1,397',
    expectedLpDate: '2026-01-01',
    desiredDeliveryDate: '2026-01-01',
    binding: '100%',
    udpAllocation: 'SLAP35',
    가용시점: '2025-07-23',
    allocationId: 'SL101686',
    긴급도QpRelease: '2026-01-29',
    비고: '',
  },
  ...Array.from({ length: 12 }, () => ({ ...LP_FCST_EMPTY })),
];

const lpSummaryTableData: LpSummaryRow[] = [
  {
    product: 'CT-P13 120mg',
    제형: 'IV',
    국가: 'CA',
    pack: '1',
    cells: [n(250000), n(250000), __(), __(), __(), n(200000), __(), __(), __(), __(), __(), __(), __()],
  },
  {
    product: 'CT-P13 120mg',
    제형: 'IV',
    국가: 'AU',
    pack: '1',
    cells: [n(250000), n(100000), __(), __(), __(), __(), __(), __(), __(), n(100000), n(500000), __(), __()],
  },
  {
    product: 'CT-P13 120mg',
    제형: 'IV',
    국가: 'TR',
    pack: '2',
    cells: [__(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __()],
  },
  {
    product: 'CT-P13 120mg',
    제형: 'IV',
    국가: 'KR',
    pack: '2',
    cells: [__(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __()],
  },
  ...Array.from({ length: 12 }, () => ({
    product: '',
    제형: '',
    국가: '',
    pack: '',
    cells: ASSEMBLY_MONTHS.map(() => __()),
  })),
];

const supplyAiTableData: SupplyAiRow[] = [
  {
    process: '충전', product: 'CT-P13 SC 25G', batchSize: '100K',
    fullEnd: 9, semiEnd: 11,
    cells: [n(500000), __(), n(100000), __(), n(300000), n(300000), n(200000), n(300000), n(300000), __(), n(300000), n(300000), __()],
  },
  {
    process: '충전', product: 'CT-P13 SC 2PS', batchSize: '100K',
    fullEnd: 7, semiEnd: 9,
    cells: [__(), __(), n(100000), __(), __(), __(), __(), __(), __(), __(), __(), __(), __()],
  },
  {
    process: '충전', product: 'CT-P17 20MG', batchSize: '37K',
    fullEnd: 5, semiEnd: 8,
    cells: [__(), __(), __(), __(), __(), __(), __(), __(), n(37000), __(), __(), __(), __()],
  },
  {
    process: '충전', product: 'CT-P17 40MG', batchSize: '82K',
    fullEnd: 11, semiEnd: 12,
    cells: [n(656000), __(), n(492000), n(82000), n(410000), n(246000), __(), n(82000), n(246000), __(), n(410000), __(), n(410000)],
  },
  {
    process: '충전', product: 'CT-P13 SC 25G', batchSize: '100K',
    fullEnd: 9, semiEnd: 11,
    cells: [n(200000), __(), n(100000), n(400000), n(100000), n(100000), n(20000), n(20000), __(), n(100000), n(400000), n(100000), __()],
  },
  {
    process: '충전', product: 'CT-P13 SC 2PS', batchSize: '100K',
    fullEnd: 6, semiEnd: 9,
    cells: [n(100000), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __()],
  },
  {
    process: '충전', product: 'CT-P17 40MG AI', batchSize: '82K',
    fullEnd: 11, semiEnd: 12,
    cells: [n(246000), __(), n(410000), n(1640000), __(), __(), __(), __(), n(1066000), n(984000), n(1066000), n(574000), __()],
  },
  {
    process: '충전', product: 'CT-P39 300MG AI', batchSize: '30K',
    fullEnd: 7, semiEnd: 10,
    cells: [__(), __(), __(), __(), __(), __(), __(), n(9500), n(36200), n(72700), __(), __(), n(80000)],
  },
  {
    process: '충전', product: 'CT-P43 45MG AI', batchSize: '25K',
    fullEnd: 9, semiEnd: 11,
    cells: [__(), __(), __(), __(), __(), __(), __(), __(), n(28000), __(), __(), __(), __()],
  },
  ...Array.from({ length: 4 }, () => ({
    process: '',
    product: '',
    batchSize: '',
    fullEnd: -1,
    semiEnd: -1,
    cells: ASSEMBLY_MONTHS.map(() => __()),
  })),
];

const supplyAssemblyTableData: SupplyAssemblyRow[] = [
  {
    product: 'CT-P13 120mg', formulation: 'AI', country: 'CA', pack: '1', step: '라벨링',
    fullEnd: 1, semiEnd: 2,
    cells: [n(250000), n(100000), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __()],
  },
  {
    product: 'CT-P13 120mg', formulation: 'AI', country: 'AU', pack: '1', step: '카토닝',
    fullEnd: 0, semiEnd: 1,
    cells: [n(250000), __(), __(), __(), __(), n(200000), __(), __(), __(), n(100000), n(300000), __(), __()],
  },
  {
    product: 'CT-P13 120mg', formulation: 'PFS', country: 'TR', pack: '2', step: '조립/라벨링',
    fullEnd: 1, semiEnd: 2,
    cells: [__(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __()],
  },
  {
    product: 'CT-P13 120mg', formulation: 'PFS', country: 'TW', pack: '2', step: '외부카토닝',
    fullEnd: -1, semiEnd: -1,
    cells: [__(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __()],
  },
  ...Array.from({ length: 8 }, () => ({
    product: '',
    formulation: '',
    country: '',
    pack: '',
    step: '',
    fullEnd: -1,
    semiEnd: -1,
    cells: ASSEMBLY_MONTHS.map(() => __()),
  })),
];

const supplyLpTableData: LpSummaryRow[] = [
  {
    product: 'CT-P13 120mg',
    제형: 'IV',
    국가: 'CA',
    pack: '1',
    cells: [n(250000), n(100000), __(), __(), __(), n(200000), __(), __(), __(), __(), __(), __(), __()],
  },
  {
    product: 'CT-P13 120mg',
    제형: 'IV',
    국가: 'AU',
    pack: '1',
    cells: [n(250000), __(), __(), __(), __(), __(), __(), __(), __(), n(100000), n(500000), __(), __()],
  },
  {
    product: 'CT-P13 120mg',
    제형: 'IV',
    국가: 'TR',
    pack: '2',
    cells: [__(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __()],
  },
  {
    product: 'CT-P13 120mg',
    제형: 'IV',
    국가: 'KR',
    pack: '2',
    cells: [__(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __(), __()],
  },
  ...Array.from({ length: 8 }, () => ({
    product: '',
    제형: '',
    국가: '',
    pack: '',
    cells: ASSEMBLY_MONTHS.map(() => __()),
  })),
];

const reportAssemblyTableData: ReportAssemblyRow[] = [
  {
    process: '충전',
    product: 'CT-P39 150mg',
    batchNo: '5M5P23',
    formulation: 'S/P',
    country: 'CA',
    pack: '1',
    step: '카토닝',
    dueDate: '2025-10-23',
    requestDate: '2025-10-05',
    poNo: '4500068840',
    qty: '11,999',
    shipQty: '11,999',
    startDate: '2025-10-15',
    endDate: '2025-10-22',
    coaComp: '-',
    shipPacket: '-',
    shipDate: '2025-11-07',
    deviation: '',
    dsTrace: '🔍',
    memo: 'aDP 확인 필요',
    dsLots: [{ process: '포장', product: 'CT-P39 150mg', batchNo: '5M5P23', dsLot: '22200P001' }],
  },
  ...Array.from({ length: 19 }, () => ({
    process: '',
    product: '',
    batchNo: '',
    formulation: '',
    country: '',
    pack: '',
    step: '',
    dueDate: '',
    requestDate: '',
    poNo: '',
    qty: '',
    shipQty: '',
    startDate: '',
    endDate: '',
    coaComp: '',
    shipPacket: '',
    shipDate: '',
    deviation: '',
    dsTrace: '',
    memo: '',
    dsLots: [],
  })),
];

const reportDsTableData: ReportDsRow[] = [
  { type: 'DS', product: 'CT-P13 120mg', batchNo: 'EIRUE223', formulation: '-', country: '-', pack: '-', qty: '1', receiptDate: '2026-04-01', agingDays: '9', obsolete: '-' },
  { type: 'DS', product: 'CT-P13 120mg', batchNo: 'EIRUE224', formulation: '-', country: '-', pack: '-', qty: '1', receiptDate: '2026-03-19', agingDays: '22', obsolete: '-' },
  { type: 'DS', product: 'CT-P42 2mg', batchNo: 'EIRUE225', formulation: '-', country: '-', pack: '-', qty: '1', receiptDate: '2026-03-01', agingDays: '40', obsolete: '-' },
  { type: 'DS', product: 'CT-P42 2mg', batchNo: 'EIRUE226', formulation: '-', country: '-', pack: '-', qty: '1', receiptDate: '2026-02-01', agingDays: '68', obsolete: '-' },
  { type: 'DS', product: 'CT-P39 150mg', batchNo: 'EIRUE227', formulation: '-', country: '-', pack: '-', qty: '1', receiptDate: '2026-03-29', agingDays: '12', obsolete: 'Y' },
  { type: 'DS', product: 'CT-P39 150mg', batchNo: 'EIRUE228', formulation: '-', country: '-', pack: '-', qty: '1', receiptDate: '2025-12-10', agingDays: '121', obsolete: '-' },
  { type: 'DS', product: 'CT-P39 300mg', batchNo: 'EIRUE229', formulation: '-', country: '-', pack: '-', qty: '1', receiptDate: '2026-03-10', agingDays: '31', obsolete: '-' },
  { type: 'DS', product: 'CT-P39 300mg', batchNo: 'EIRUE230', formulation: '-', country: '-', pack: '-', qty: '1', receiptDate: '2026-04-03', agingDays: '7', obsolete: '-' },
  { type: 'uDP', product: 'CT-P13 120mg', batchNo: '123', formulation: '-', country: '-', pack: '-', qty: '61,345', receiptDate: '2026-04-08', agingDays: '2', obsolete: '-' },
  { type: 'uDP', product: 'CT-P13 120mg', batchNo: '124', formulation: '-', country: '-', pack: '-', qty: '123,987', receiptDate: '2026-03-09', agingDays: '32', obsolete: '-' },
  { type: 'uDP', product: 'CT-P42 2mg', batchNo: '127', formulation: '-', country: '-', pack: '-', qty: '89,898', receiptDate: '2026-04-01', agingDays: '9', obsolete: '-' },
  { type: 'uDP', product: 'CT-P42 2mg', batchNo: '129', formulation: '-', country: '-', pack: '-', qty: '89,766', receiptDate: '2026-03-01', agingDays: '40', obsolete: '-' },
  { type: 'uDP', product: 'CT-P39 150mg', batchNo: '130', formulation: '-', country: '-', pack: '-', qty: '56,767', receiptDate: '2026-02-28', agingDays: '41', obsolete: '-' },
  { type: 'aDP', product: 'CT-P13 120mg', batchNo: '123', formulation: 'PFS', country: '-', pack: '-', qty: '3,948', receiptDate: '2025-12-10', agingDays: '121', obsolete: '-' },
  { type: 'aDP', product: 'CT-P13 120mg', batchNo: '124', formulation: 'PFS', country: '-', pack: '-', qty: '3,933', receiptDate: '2026-03-10', agingDays: '31', obsolete: '-' },
  { type: 'aDP', product: 'CT-P42 2mg', batchNo: '127', formulation: 'PFS-S', country: '-', pack: '-', qty: '233', receiptDate: '2026-04-03', agingDays: '7', obsolete: '-' },
  { type: 'aDP', product: 'CT-P39 150mg', batchNo: '130', formulation: 'PFS-S', country: '-', pack: '-', qty: '3,933', receiptDate: '2026-03-09', agingDays: '32', obsolete: 'Y' },
  { type: 'aDP', product: 'CT-P39 300mg', batchNo: '138', formulation: 'IV', country: '-', pack: '-', qty: '2,930', receiptDate: '2026-03-01', agingDays: '40', obsolete: '-' },
  { type: 'fDP', product: 'CT-P13 120mg', batchNo: '123', formulation: 'PFS', country: 'CA', pack: '2', qty: '39,333', receiptDate: '2026-04-03', agingDays: '7', obsolete: '-' },
  { type: 'fDP', product: 'CT-P42 2mg', batchNo: '127', formulation: 'PFS-S', country: 'AU', pack: '4', qty: '3,384', receiptDate: '2026-03-09', agingDays: '32', obsolete: '-' },
  { type: 'fDP', product: 'CT-P39 150mg', batchNo: '130', formulation: 'Vial', country: 'RU', pack: '6', qty: '123', receiptDate: '2026-03-01', agingDays: '40', obsolete: '-' },
  ...Array.from({ length: 6 }, () => ({
    type: '', product: '', batchNo: '', formulation: '', country: '', pack: '',
    qty: '', receiptDate: '', agingDays: '', obsolete: '',
  })),
];

const FILTERS = [
  { key: 'fcstMonth', label: 'FCST 월',   options: ['전체','2025.11 Y','2025.12 Y','2026.01 Y'] },
  { key: 'product',   label: 'Product',   options: ['전체','CT-P13 120mg','CT-P06','CT-P39','CT-P47'] },
  { key: '제형',      label: '제형 구분', options: ['전체','PFS','VIAL','A12-G'] },
  { key: '국가',      label: '국가 구분', options: ['전체','US','EU','CA','AU','TW','TR','KR'] },
  { key: 'pack',      label: 'Pack',      options: ['전체','1','2','3','4'] },
];

const SUPPLY_AI_FILTERS = [
  { key: 'planMonth', label: '계획 월', options: ['2025.11'] },
  { key: 'process', label: 'Process', options: ['충전', '조립'] },
  { key: 'step', label: '공정 구분', options: ['컨트리온'] },
  { key: 'product', label: 'Product', options: ['CT-P39 150mg', '유플라이마 40mg', 'CT-P39 300MG AI'] },
];

const SUPPLY_ASSEMBLY_FILTERS = [
  { key: 'planMonth', label: '계획 월', options: ['2025.11'] },
  { key: 'product', label: 'Product', options: ['CT-P13 120mg', 'CT-P17 20mg', 'CT-P06'] },
  { key: 'formulation', label: '제형 구분', options: ['PFS', 'PFS-S', 'AI'] },
  { key: 'country', label: '국가 구분', options: ['CA', 'AU', 'TR', 'TW'] },
  { key: 'pack', label: 'Pack 구분', options: ['1', '2', '3', '6'] },
  { key: 'step', label: '공정 구분', options: ['카토닝', '외부카토닝'] },
];

const SUPPLY_LP_FILTERS = [
  { key: 'planMonth', label: '계획 월', options: ['2025.11'] },
  { key: 'product', label: 'Product', options: ['CT-P13 120mg', 'CT-P17 20mg', 'CT-P06'] },
  { key: 'formulation', label: '제형 구분', options: ['IV'] },
  { key: 'country', label: '국가 구분', options: ['CA', 'AU', 'TR', 'TW'] },
  { key: 'pack', label: 'Pack 구분', options: ['1', '2'] },
];

const REPORT_SUPPLY_FILTERS = [
  { key: 'opMonth', label: '운영 월', options: ['2025.11'] },
  { key: 'process', label: 'Process', options: ['충전', '조립', '포장', 'L&P'] },
  { key: 'product', label: 'Product', options: ['CT-P13 120mg', 'CT-P17 20mg', 'CT-P06'] },
  { key: 'formulation', label: '제형 구분', options: ['PFS', 'PFS-S', 'AI', 'Vial'] },
  { key: 'country', label: '국가 구분', options: ['CA', 'AU', 'TR', 'TW'] },
  { key: 'pack', label: 'Pack 구분', options: ['1', '2', '3', '6'] },
  { key: 'step', label: '공정 구분', options: ['라벨링', '조립/라벨/카토닝', '외부카토닝'] },
];

const REPORT_ASSEMBLY_FILTERS = [
  { key: 'process', label: 'Process', options: ['포장', 'L&P'] },
  { key: 'product', label: 'Product', options: ['CT-P39 150mg', '유플라이머 40mg', 'foatlak 12mg 29G'] },
  { key: 'formulation', label: '제형 구분', options: ['PFS', 'PFS-S', 'AI'] },
  { key: 'country', label: '국가 구분', options: ['CA', 'AU', 'TR', 'TW'] },
  { key: 'pack', label: 'Pack 구분', options: ['1', '2', '3', '6'] },
  { key: 'step', label: '공정 구분', options: ['카토닝', '외부카토닝'] },
];

const REPORT_DS_FILTERS = [
  { key: 'type', label: 'Type', options: ['DS', 'uDP', 'aDP', 'fDP'] },
  { key: 'product', label: 'Product', options: ['CT-P39 150mg', '유플라이마 40mg', 'foatlak 12mg 29G'] },
  { key: 'country', label: '국가 구분', options: ['CA', 'AU'] },
  { key: 'formulation', label: '제형 구분', options: ['PFS', 'PFS-S', 'AI', 'Vial'] },
  { key: 'obsolete', label: '불용여부', options: ['Y', '-'] },
];

/* ── Select ─────────────────────────────────────────── */
function Select({ label, options, value, onChange, isDark }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; isDark: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 110 }}>
      <label style={{
        fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--text-tertiary)',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            appearance: 'none', WebkitAppearance: 'none',
            padding: '7px 28px 7px 10px',
            border: '1px solid var(--border-primary)', borderRadius: 9,
            fontSize: 12.5, fontWeight: 500,
            color: 'var(--text-primary)', background: 'var(--input-bg)',
            outline: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%',
            colorScheme: isDark ? 'dark' : 'light',
          } as React.CSSProperties}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={12} style={{
          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-tertiary)', pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

/* ── Action Button ──────────────────────────────────── */
function ActionBtn({ label, icon, primary, onClick }: {
  label: string; icon?: React.ReactNode; primary?: boolean; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 16px',
        background: primary ? 'var(--brand-primary)' : 'var(--surface-bg)',
        border: primary ? 'none' : '1px solid var(--border-primary)',
        borderRadius: 10, fontSize: 13, fontWeight: 600,
        color: primary ? '#fff' : 'var(--text-primary)',
        cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
        transition: 'opacity 150ms',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {icon}{label}
    </button>
  );
}

/* ── Page ─────────────��─────────────────────────────── */
export function OrderManagementPage() {
  const [activeTab,     setActiveTab]     = useState(0);
  const [filterOpen,    setFilterOpen]    = useState(false);
  const [filterValues,  setFilterValues]  = useState<Record<string, string>>({});
  const [activeTags,    setActiveTags]    = useState<string[]>([]);
  const [inputBatch,    setInputBatch]    = useState(false);
  const [inputQty,      setInputQty]      = useState(true);
  const [reportAsmBatchNo, setReportAsmBatchNo] = useState('');
  const [reportAsmDevYes, setReportAsmDevYes] = useState(false);
  const [reportAsmDevNo, setReportAsmDevNo] = useState(false);
  const [reportAsmStartDate, setReportAsmStartDate] = useState('');
  const [reportAsmEndDate, setReportAsmEndDate] = useState('');
  const [reportAsmDsPopupRow, setReportAsmDsPopupRow] = useState<ReportAssemblyRow | null>(null);
  const [reportDsBatchNo, setReportDsBatchNo] = useState('');
  const [reportDsReceiptFrom, setReportDsReceiptFrom] = useState('');
  const [reportDsReceiptTo, setReportDsReceiptTo] = useState('');
  const [reportDsAgingFrom, setReportDsAgingFrom] = useState('');
  const [reportDsAgingTo, setReportDsAgingTo] = useState('');
  const [keyword,       setKeyword]       = useState('');
  const [page,          setPage]          = useState(1);
  const [attachOpen,    setAttachOpen]    = useState(false);
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isAssemblySummary = location.pathname === '/plan/assembly-summary';
  const isLpSummary = location.pathname === '/plan/lp-summary';
  const isLpFcst = location.pathname === '/plan/lp-fcst';
  const isSupplyAi = location.pathname === '/supply/ai';
  const isSupplyAssembly = location.pathname === '/supply/assembly';
  const isSupplyLp = location.pathname === '/supply/lp';
  const isReportSupply = location.pathname === '/report/supply';
  const isReportAssembly = location.pathname === '/report/assembly';
  const isReportDs = location.pathname === '/report/ds';
  const activeFilters = isSupplyAi
    ? SUPPLY_AI_FILTERS
    : isSupplyAssembly
      ? SUPPLY_ASSEMBLY_FILTERS
    : isSupplyLp
      ? SUPPLY_LP_FILTERS
    : isReportDs
      ? REPORT_DS_FILTERS
    : isReportAssembly
      ? REPORT_ASSEMBLY_FILTERS
    : isReportSupply
      ? REPORT_SUPPLY_FILTERS
      : FILTERS;
  const activeHeaders = isLpFcst
    ? LP_FCST_HEADERS
    : isReportDs
      ? REPORT_DS_HEADERS
    : isReportAssembly
      ? REPORT_ASSEMBLY_HEADERS
      : HEADERS;
  const activeTableData: (TableRow | AssemblyFcstRow | LpFcstRow | LpSummaryRow | SupplyAiRow | SupplyAssemblyRow | ReportAssemblyRow | ReportDsRow)[] = isAssemblySummary
    ? assemblyFcstTableData
    : isLpSummary
      ? lpSummaryTableData
    : isReportDs
      ? reportDsTableData
    : isReportAssembly
      ? reportAssemblyTableData
    : isSupplyLp
      ? supplyLpTableData
    : isSupplyAssembly
      ? supplyAssemblyTableData
    : isSupplyAi
      ? supplyAiTableData
    : isLpFcst
      ? lpFcstTableData
      : tableData;

  const ROWS_PER_PAGE = 10;
  const totalPages    = Math.ceil(activeTableData.length / ROWS_PER_PAGE);
  const visibleRows   = activeTableData.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const activeCount = activeTags.length;
  const getDefaultFilterValue = (key: string) => activeFilters.find(f => f.key === key)?.options[0] ?? '전체';

  const handleFilterChange = (key: string, val: string) => {
    setFilterValues(prev => ({ ...prev, [key]: val }));
    const defaultVal = getDefaultFilterValue(key);
    if (val !== defaultVal && !activeTags.includes(key)) {
      setActiveTags(prev => [...prev, key]);
    } else if (val === defaultVal) {
      setActiveTags(prev => prev.filter(t => t !== key));
    }
  };

  const removeTag = (key: string) => {
    setFilterValues(prev => ({ ...prev, [key]: getDefaultFilterValue(key) }));
    setActiveTags(prev => prev.filter(t => t !== key));
  };

  const resetAll = () => {
    setFilterValues({});
    setActiveTags([]);
    setInputBatch(false);
    setInputQty(true);
    setReportAsmBatchNo('');
    setReportAsmDevYes(false);
    setReportAsmDevNo(false);
    setReportAsmStartDate('');
    setReportAsmEndDate('');
    setReportDsBatchNo('');
    setReportDsReceiptFrom('');
    setReportDsReceiptTo('');
    setReportDsAgingFrom('');
    setReportDsAgingTo('');
    setKeyword('');
  };

  const tabGroup = resolveTabGroup(location.pathname);
  const tabs = tabGroup.type === 'route' ? tabGroup.tabs.map(t => t.label) : tabGroup.tabs;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Tab bar ────────────────────────────────────── */}
      <div style={{
        background: 'var(--surface-bg)',
        borderBottom: '1px solid var(--border-primary)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 2,
        flexShrink: 0,
      }}>
        {tabs.map((tab, i) => {
          const isActive = tabGroup.type === 'route'
            ? location.pathname === tabGroup.tabs[i].path
            : activeTab === i;
          return (
            <button
              key={tab}
              onClick={() => {
                if (tabGroup.type === 'route') {
                  navigate(tabGroup.tabs[i].path);
                } else {
                  setActiveTab(i);
                }
              }}
              style={{
                padding: '13px 18px 11px',
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${isActive ? 'var(--brand-primary)' : 'transparent'}`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 150ms, border-color 150ms',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── Slim toolbar: filter toggle + keyword search ─ */}
      <div style={{
        background: 'var(--surface-bg)',
        borderBottom: filterOpen ? 'none' : '1px solid var(--border-secondary)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        {/* Filter toggle button */}
        <button
          onClick={() => setFilterOpen(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '7px 14px',
            background: filterOpen ? 'var(--nav-active-bg)' : 'var(--surface-bg)',
            border: `1px solid ${filterOpen ? 'rgba(0,176,80,0.35)' : 'var(--border-primary)'}`,
            borderRadius: 10, fontSize: 12.5, fontWeight: 600,
            color: filterOpen ? 'var(--brand-primary)' : 'var(--text-secondary)',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 150ms',
            position: 'relative',
          }}
        >
          <SlidersHorizontal size={14} />
          필터
          {activeCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -6, right: -6,
              width: 16, height: 16,
              borderRadius: '50%',
              background: 'var(--brand-primary)',
              color: '#fff',
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {activeCount}
            </span>
          )}
        </button>

        {/* Active filter chips */}
        {activeTags.map(key => {
          const f = activeFilters.find(fi => fi.key === key);
          return (
            <span key={key} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 8px 4px 10px',
              background: 'var(--nav-active-bg)',
              border: '1px solid rgba(0,176,80,0.25)',
              borderRadius: 20,
              fontSize: 11.5, fontWeight: 600,
              color: 'var(--brand-primary)',
            }}>
              {f?.label}: {filterValues[key]}
              <button onClick={() => removeTag(key)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'inherit', display: 'flex', alignItems: 'center', padding: 0,
              }}>
                <X size={10} />
              </button>
            </span>
          );
        })}

        {activeTags.length > 0 && (
          <button onClick={resetAll} style={{
            fontSize: 11.5, color: 'var(--text-tertiary)', background: 'none',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <RotateCcw size={11} /> 초기화
          </button>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {(isAssemblySummary || isSupplyAi || isSupplyAssembly) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-tertiary)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: BG_FULL_L, border: '1px solid #9ecda8', flexShrink: 0 }} />
              100% 바인딩
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-tertiary)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: BG_SEMI_L, border: '1px solid #d6c46a', flexShrink: 0 }} />
              Semi 바인딩
            </span>
          </div>
        )}

        {/* Keyword search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '7px 12px',
          border: '1px solid var(--border-primary)', borderRadius: 10,
          background: 'var(--input-bg)',
        }}>
          <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="키워드 검색..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: 12.5, color: 'var(--text-primary)', width: 160, fontFamily: 'inherit',
            }}
          />
          {keyword && (
            <button onClick={() => setKeyword('')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-tertiary)', display: 'flex', padding: 0,
            }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── Collapsible filter panel ─────────────────────── */}
      <div style={{
        background: 'var(--surface-bg)',
        overflow: 'hidden',
        maxHeight: filterOpen ? ((isSupplyAssembly || isReportSupply || isReportAssembly || isReportDs) ? '220px' : '120px') : '0px',
        opacity: filterOpen ? 1 : 0,
        transition: 'max-height 250ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease',
        borderBottom: filterOpen ? '1px solid var(--border-secondary)' : 'none',
        flexShrink: 0,
      }}>
        <div style={{
          padding: '14px 24px 16px',
          display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap',
        }}>
          {activeFilters.map(f => (
            <Select
              key={f.key}
              label={f.label}
              options={f.options}
              value={filterValues[f.key] ?? f.options[0]}
              onChange={v => handleFilterChange(f.key, v)}
              isDark={isDark}
            />
          ))}
          {isReportAssembly && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 110 }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                  Batch No
                </span>
                <input
                  type="text"
                  value={reportAsmBatchNo}
                  onChange={e => setReportAsmBatchNo(e.target.value)}
                  style={{
                    padding: '7px 10px',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 9,
                    fontSize: 12.5,
                    color: 'var(--text-primary)',
                    background: 'var(--input-bg)',
                    outline: 'none',
                    fontFamily: 'inherit',
                    width: 110,
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 110 }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                  Deviation
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 33 }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#dc2626', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={reportAsmDevYes}
                      onChange={e => setReportAsmDevYes(e.target.checked)}
                      style={{ width: 13, height: 13, accentColor: '#00B050', cursor: 'pointer' }}
                    />
                    Yes
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={reportAsmDevNo}
                      onChange={e => setReportAsmDevNo(e.target.checked)}
                      style={{ width: 13, height: 13, accentColor: '#00B050', cursor: 'pointer' }}
                    />
                    No
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150 }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                  Start Date
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="date"
                    value={reportAsmStartDate}
                    onChange={e => setReportAsmStartDate(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      border: '1px solid var(--border-primary)',
                      borderRadius: 7,
                      fontSize: 12,
                      color: 'var(--text-primary)',
                      background: 'var(--input-bg)',
                      outline: 'none',
                      fontFamily: 'inherit',
                      minWidth: 0,
                      colorScheme: isDark ? 'dark' : 'light',
                    }}
                  />
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>~</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150 }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                  End Date
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="date"
                    value={reportAsmEndDate}
                    onChange={e => setReportAsmEndDate(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      border: '1px solid var(--border-primary)',
                      borderRadius: 7,
                      fontSize: 12,
                      color: 'var(--text-primary)',
                      background: 'var(--input-bg)',
                      outline: 'none',
                      fontFamily: 'inherit',
                      minWidth: 0,
                      colorScheme: isDark ? 'dark' : 'light',
                    }}
                  />
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>~</span>
                </div>
              </div>
            </>
          )}
          {isReportDs && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 110 }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                  Batch No
                </span>
                <input
                  type="text"
                  value={reportDsBatchNo}
                  onChange={e => setReportDsBatchNo(e.target.value)}
                  style={{
                    padding: '7px 10px',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 9,
                    fontSize: 12.5,
                    color: 'var(--text-primary)',
                    background: 'var(--input-bg)',
                    outline: 'none',
                    fontFamily: 'inherit',
                    width: 110,
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150 }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                  입고일자
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="date"
                    value={reportDsReceiptFrom}
                    onChange={e => setReportDsReceiptFrom(e.target.value)}
                    style={{
                      flex: 1, padding: '6px 8px', border: '1px solid var(--border-primary)',
                      borderRadius: 7, fontSize: 12, color: 'var(--text-primary)',
                      background: 'var(--input-bg)', outline: 'none', fontFamily: 'inherit',
                      minWidth: 0, colorScheme: isDark ? 'dark' : 'light',
                    }}
                  />
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>~</span>
                </div>
                <input
                  type="date"
                  value={reportDsReceiptTo}
                  onChange={e => setReportDsReceiptTo(e.target.value)}
                  style={{
                    padding: '6px 8px', border: '1px solid var(--border-primary)',
                    borderRadius: 7, fontSize: 12, color: 'var(--text-primary)',
                    background: 'var(--input-bg)', outline: 'none', fontFamily: 'inherit',
                    colorScheme: isDark ? 'dark' : 'light',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150 }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                  Aging일수
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="number"
                    value={reportDsAgingFrom}
                    onChange={e => setReportDsAgingFrom(e.target.value)}
                    style={{
                      flex: 1, padding: '6px 8px', border: '1px solid var(--border-primary)',
                      borderRadius: 7, fontSize: 12, color: 'var(--text-primary)',
                      background: 'var(--input-bg)', outline: 'none', fontFamily: 'inherit', minWidth: 0,
                    }}
                  />
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>~</span>
                </div>
                <input
                  type="number"
                  value={reportDsAgingTo}
                  onChange={e => setReportDsAgingTo(e.target.value)}
                  style={{
                    padding: '6px 8px', border: '1px solid var(--border-primary)',
                    borderRadius: 7, fontSize: 12, color: 'var(--text-primary)',
                    background: 'var(--input-bg)', outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>
            </>
          )}
          {isSupplyAi && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 128 }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                입력 구분
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 33 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: 500, color: 'var(--text-primary)' }}>
                  <input
                    type="checkbox"
                    checked={inputBatch}
                    onChange={e => setInputBatch(e.target.checked)}
                    style={{ width: 15, height: 15, accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
                  />
                  배치
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: 500, color: 'var(--text-primary)' }}>
                  <input
                    type="checkbox"
                    checked={inputQty}
                    onChange={e => setInputQty(e.target.checked)}
                    style={{ width: 15, height: 15, accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
                  />
                  수량
                </label>
              </div>
            </div>
          )}
          <button
            onClick={resetAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 14px', marginBottom: 1,
              background: 'transparent',
              border: '1px solid var(--border-primary)',
              borderRadius: 9, fontSize: 12, fontWeight: 500,
              color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'color 120ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            <RotateCcw size={12} /> 초기화
          </button>
        </div>
      </div>

      {/* ── Data grid ──────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        padding: '16px 24px 0',
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          background: 'var(--surface-bg)',
          borderRadius: '14px 14px 0 0',
          border: '1px solid var(--border-primary)',
          borderBottom: 'none',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
            {isSupplyAi ? (
              <table style={{
                width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed',
                minWidth: 90 + 160 + 90 + ASSEMBLY_MONTHS.length * 84,
              }}>
                <colgroup>
                  <col style={{ width: 90 }} />
                  <col style={{ width: 160 }} />
                  <col style={{ width: 90 }} />
                  {ASSEMBLY_MONTHS.map((_, i) => <col key={i} style={{ width: 84 }} />)}
                </colgroup>
                <thead>
                  <tr style={{ background: 'var(--bg-faint)', borderBottom: '2px solid var(--border-primary)' }}>
                    {['Process', 'Product', 'batch size'].map((lbl, i) => (
                      <th key={lbl} style={{
                        padding: '10px 12px', textAlign: 'left',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                        color: i < 2 ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                        whiteSpace: 'nowrap', borderRight: '1px solid var(--border-secondary)', userSelect: 'none',
                      }}>{lbl}</th>
                    ))}
                    {ASSEMBLY_MONTHS.map((m) => (
                      <th key={m} style={{
                        padding: '10px 8px', textAlign: 'right',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                        color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
                        borderRight: '1px solid var(--border-secondary)', userSelect: 'none',
                      }}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((raw, ri) => {
                    const row = raw as SupplyAiRow;
                    return (
                      <tr key={ri} style={{ borderBottom: '1px solid var(--border-secondary)', cursor: 'pointer' }}>
                        {[row.process, row.product, row.batchSize].map((val, ci) => (
                          <td key={ci} style={{
                            padding: '10px 12px', fontSize: 12.5,
                            color: val ? (ci < 2 ? 'var(--text-primary)' : 'var(--text-secondary)') : 'var(--text-tertiary)',
                            fontWeight: ci < 2 ? 600 : 400,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            borderRight: '1px solid var(--border-secondary)',
                          }}>{val || '—'}</td>
                        ))}
                        {row.cells.map((cell, ci) => {
                          const bg = getAssemblyCellBg(ci, row, isDark);
                          const isFullSemiBorder = ci === row.fullEnd && row.semiEnd > row.fullEnd;
                          return (
                            <td key={ci} style={{
                              padding: '10px 8px', fontSize: 12.5,
                              textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                              background: bg,
                              color: cell.v !== null ? 'var(--text-primary)' : 'transparent',
                              fontWeight: cell.v !== null ? 600 : 400,
                              borderRight: isFullSemiBorder ? '2px solid #9ecda8' : '1px solid var(--border-secondary)',
                            }}>
                              {cell.v !== null ? fmt(cell.v) : ''}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : isSupplyAssembly ? (
              <table style={{
                width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed',
                minWidth: 128 + 64 + 56 + 52 + 148 + ASSEMBLY_MONTHS.length * 84,
              }}>
                <colgroup>
                  <col style={{ width: 128 }} />
                  <col style={{ width: 64 }} />
                  <col style={{ width: 56 }} />
                  <col style={{ width: 52 }} />
                  <col style={{ width: 148 }} />
                  {ASSEMBLY_MONTHS.map((_, i) => <col key={i} style={{ width: 84 }} />)}
                </colgroup>
                <thead>
                  <tr style={{ background: 'var(--bg-faint)', borderBottom: '2px solid var(--border-primary)' }}>
                    {['Product', '제형', '국가', 'Pack', '공정'].map((lbl, i) => (
                      <th key={lbl} style={{
                        padding: '10px 12px', textAlign: 'left',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                        color: i === 0 ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                        whiteSpace: 'nowrap', borderRight: '1px solid var(--border-secondary)', userSelect: 'none',
                      }}>{lbl}</th>
                    ))}
                    {ASSEMBLY_MONTHS.map((m) => (
                      <th key={m} style={{
                        padding: '10px 8px', textAlign: 'right',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                        color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
                        borderRight: '1px solid var(--border-secondary)', userSelect: 'none',
                      }}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((raw, ri) => {
                    const row = raw as SupplyAssemblyRow;
                    return (
                      <tr key={ri} style={{ borderBottom: '1px solid var(--border-secondary)', cursor: 'pointer' }}>
                        {[row.product, row.formulation, row.country, row.pack, row.step].map((val, ci) => (
                          <td key={ci} style={{
                            padding: '10px 12px', fontSize: 12.5,
                            color: val ? (ci === 0 ? 'var(--text-primary)' : 'var(--text-secondary)') : 'var(--text-tertiary)',
                            fontWeight: ci === 0 ? 600 : 400,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            borderRight: '1px solid var(--border-secondary)',
                          }}>{val || '—'}</td>
                        ))}
                        {row.cells.map((cell, ci) => {
                          const bg = getAssemblyCellBg(ci, row, isDark);
                          const isFullSemiBorder = ci === row.fullEnd && row.semiEnd > row.fullEnd;
                          return (
                            <td key={ci} style={{
                              padding: '10px 8px', fontSize: 12.5,
                              textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                              background: bg,
                              color: cell.v !== null ? 'var(--text-primary)' : 'transparent',
                              fontWeight: cell.v !== null ? 600 : 400,
                              borderRight: isFullSemiBorder ? '2px solid #9ecda8' : '1px solid var(--border-secondary)',
                            }}>
                              {cell.v !== null ? fmt(cell.v) : ''}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : isAssemblySummary ? (
              <table style={{
                width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed',
                minWidth: 128 + 64 + 56 + 52 + 148 + ASSEMBLY_MONTHS.length * 84,
              }}>
                <colgroup>
                  <col style={{ width: 128 }} />
                  <col style={{ width: 64 }} />
                  <col style={{ width: 56 }} />
                  <col style={{ width: 52 }} />
                  <col style={{ width: 148 }} />
                  {ASSEMBLY_MONTHS.map((_, i) => <col key={i} style={{ width: 84 }} />)}
                </colgroup>
                <thead>
                  <tr style={{ background: 'var(--bg-faint)', borderBottom: '2px solid var(--border-primary)' }}>
                    {['Product', '제형', '국가', 'Pack', '상세 공정'].map((lbl, i) => (
                      <th key={lbl} style={{
                        padding: '10px 12px', textAlign: 'left',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                        color: i === 0 ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                        whiteSpace: 'nowrap', borderRight: '1px solid var(--border-secondary)', userSelect: 'none',
                      }}>{lbl}</th>
                    ))}
                    {ASSEMBLY_MONTHS.map((m) => (
                      <th key={m} style={{
                        padding: '10px 8px', textAlign: 'right',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                        color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
                        borderRight: '1px solid var(--border-secondary)', userSelect: 'none',
                      }}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((raw, ri) => {
                    const row = raw as AssemblyFcstRow;
                    return (
                      <tr key={ri} style={{ borderBottom: '1px solid var(--border-secondary)', cursor: 'pointer' }}>
                        {[row.product, row.제형, row.국가, row.pack, row.상세공정].map((val, ci) => (
                          <td key={ci} style={{
                            padding: '10px 12px', fontSize: 12.5,
                            color: val ? (ci === 0 ? 'var(--text-primary)' : 'var(--text-secondary)') : 'var(--text-tertiary)',
                            fontWeight: ci === 0 ? 600 : 400,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            borderRight: '1px solid var(--border-secondary)',
                          }}>{val || '—'}</td>
                        ))}
                        {row.cells.map((cell, ci) => {
                          const bg = getAssemblyCellBg(ci, row, isDark);
                          const isFullSemiBorder = ci === row.fullEnd && row.semiEnd > row.fullEnd;
                          return (
                            <td key={ci} style={{
                              padding: '10px 8px', fontSize: 12.5,
                              textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                              background: bg,
                              color: cell.v !== null ? 'var(--text-primary)' : 'transparent',
                              fontWeight: cell.v !== null ? 600 : 400,
                              borderRight: isFullSemiBorder ? '2px solid #9ecda8' : '1px solid var(--border-secondary)',
                            }}>
                              {cell.v !== null ? fmt(cell.v) : ''}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : isSupplyLp ? (
              <table style={{
                width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed',
                minWidth: 128 + 64 + 56 + 52 + ASSEMBLY_MONTHS.length * 84,
              }}>
                <colgroup>
                  <col style={{ width: 128 }} />
                  <col style={{ width: 64 }} />
                  <col style={{ width: 56 }} />
                  <col style={{ width: 52 }} />
                  {ASSEMBLY_MONTHS.map((_, i) => <col key={i} style={{ width: 84 }} />)}
                </colgroup>
                <thead>
                  <tr style={{ background: 'var(--bg-faint)', borderBottom: '2px solid var(--border-primary)' }}>
                    {['Product', '제형', '국가', 'Pack'].map((lbl, i) => (
                      <th key={lbl} style={{
                        padding: '10px 12px', textAlign: 'left',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                        color: i === 0 ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                        whiteSpace: 'nowrap', borderRight: '1px solid var(--border-secondary)', userSelect: 'none',
                      }}>{lbl}</th>
                    ))}
                    {ASSEMBLY_MONTHS.map((m) => (
                      <th key={m} style={{
                        padding: '10px 8px', textAlign: 'right',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                        color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
                        borderRight: '1px solid var(--border-secondary)', userSelect: 'none',
                      }}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((raw, ri) => {
                    const row = raw as LpSummaryRow;
                    return (
                      <tr key={ri} style={{ borderBottom: '1px solid var(--border-secondary)', cursor: 'pointer' }}>
                        {[row.product, row.제형, row.국가, row.pack].map((val, ci) => (
                          <td key={ci} style={{
                            padding: '10px 12px', fontSize: 12.5,
                            color: val ? (ci === 0 ? 'var(--text-primary)' : 'var(--text-secondary)') : 'var(--text-tertiary)',
                            fontWeight: ci === 0 ? 600 : 400,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            borderRight: '1px solid var(--border-secondary)',
                          }}>{val || '—'}</td>
                        ))}
                        {row.cells.map((cell, ci) => (
                          <td key={ci} style={{
                            padding: '10px 8px', fontSize: 12.5,
                            textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                            background: cell.v !== null && ci === 0 ? BG_FULL_L : 'transparent',
                            color: cell.v !== null ? 'var(--text-primary)' : 'transparent',
                            fontWeight: cell.v !== null ? 600 : 400,
                            borderRight: '1px solid var(--border-secondary)',
                          }}>
                            {cell.v !== null ? fmt(cell.v) : ''}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : isLpSummary ? (
              <table style={{
                width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed',
                minWidth: 128 + 64 + 56 + 52 + ASSEMBLY_MONTHS.length * 84,
              }}>
                <colgroup>
                  <col style={{ width: 128 }} />
                  <col style={{ width: 64 }} />
                  <col style={{ width: 56 }} />
                  <col style={{ width: 52 }} />
                  {ASSEMBLY_MONTHS.map((_, i) => <col key={i} style={{ width: 84 }} />)}
                </colgroup>
                <thead>
                  <tr style={{ background: 'var(--bg-faint)', borderBottom: '2px solid var(--border-primary)' }}>
                    {['Product', '제형', '국가', 'Pack'].map((lbl, i) => (
                      <th key={lbl} style={{
                        padding: '10px 12px', textAlign: 'left',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                        color: i === 0 ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                        whiteSpace: 'nowrap', borderRight: '1px solid var(--border-secondary)', userSelect: 'none',
                      }}>{lbl}</th>
                    ))}
                    {ASSEMBLY_MONTHS.map((m) => (
                      <th key={m} style={{
                        padding: '10px 8px', textAlign: 'right',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                        color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
                        borderRight: '1px solid var(--border-secondary)', userSelect: 'none',
                      }}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((raw, ri) => {
                    const row = raw as LpSummaryRow;
                    return (
                      <tr key={ri} style={{ borderBottom: '1px solid var(--border-secondary)', cursor: 'pointer' }}>
                        {[row.product, row.제형, row.국가, row.pack].map((val, ci) => (
                          <td key={ci} style={{
                            padding: '10px 12px', fontSize: 12.5,
                            color: val ? (ci === 0 ? 'var(--text-primary)' : 'var(--text-secondary)') : 'var(--text-tertiary)',
                            fontWeight: ci === 0 ? 600 : 400,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            borderRight: '1px solid var(--border-secondary)',
                          }}>{val || '—'}</td>
                        ))}
                        {row.cells.map((cell, ci) => (
                          <td key={ci} style={{
                            padding: '10px 8px', fontSize: 12.5,
                            textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                            background: cell.v !== null && ci <= 1 ? BG_FULL_L : 'transparent',
                            color: cell.v !== null ? 'var(--text-primary)' : 'transparent',
                            fontWeight: cell.v !== null ? 600 : 400,
                            borderRight: '1px solid var(--border-secondary)',
                          }}>
                            {cell.v !== null ? fmt(cell.v) : ''}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table style={{
                width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed',
                minWidth: activeHeaders.reduce((a, h) => a + (h.width ?? 100), 0),
              }}>
                <colgroup>
                  {activeHeaders.map(h => <col key={h.key} style={{ width: h.width ?? 100 }} />)}
                </colgroup>
                <thead>
                  <tr style={{ background: 'var(--bg-faint)', borderBottom: '2px solid var(--border-primary)' }}>
                    {activeHeaders.map(h => (
                      <th key={h.key} style={{
                        padding: '10px 12px', textAlign: 'left',
                        fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.04em', textTransform: 'uppercase',
                        color: h.pin ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        borderRight: '1px solid var(--border-secondary)',
                        userSelect: 'none',
                      }}>
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, ri) => (
                    <tr
                      key={ri}
                      style={{ borderBottom: '1px solid var(--border-secondary)', transition: 'background 100ms', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-faint)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {activeHeaders.map((h, ci) => {
                        const val = String((row as Record<string, unknown>)[h.key] ?? '');
                        const isEmpty = val === '' || val === '-';
                        if (isReportAssembly && h.key === 'dsTrace') {
                          const dsRow = row as ReportAssemblyRow;
                          return (
                            <td key={ci} style={{
                              padding: '10px 12px', fontSize: 12.5, textAlign: 'center',
                              borderRight: '1px solid var(--border-secondary)',
                            }}>
                              {dsRow.dsLots.length > 0 ? (
                                <button
                                  onClick={() => setReportAsmDsPopupRow(dsRow)}
                                  title="DS 추적 보기"
                                  style={{
                                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                                    borderRadius: 6, display: 'inline-flex', alignItems: 'center',
                                    color: 'var(--brand-primary)', transition: 'background 120ms',
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,176,80,0.12)')}
                                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                                >
                                  <ZoomIn size={15} strokeWidth={2} />
                                </button>
                              ) : (
                                <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>—</span>
                              )}
                            </td>
                          );
                        }
                        return (
                          <td key={ci} style={{
                            padding: '10px 12px', fontSize: 12.5,
                            color: isEmpty ? 'var(--text-tertiary)' : ci === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: ci === 0 ? 600 : 400,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            borderRight: '1px solid var(--border-secondary)',
                          }}>
                            {isEmpty ? '—' : val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom bar: pagination (left) + actions (right) ─ */}
      <div style={{
        margin: '0 24px',
        padding: '10px 18px',
        background: 'var(--surface-bg)',
        border: '1px solid var(--border-primary)',
        borderTop: '1px solid var(--border-secondary)',
        borderRadius: '0 0 14px 14px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        gap: 12,
      }}>
        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginRight: 4 }}>
            총 <b style={{ color: 'var(--text-primary)' }}>{activeTableData.length}</b>건
          </span>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={pageBtn(page === 1)}
          >
            <ChevronLeft size={13} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: 28, height: 28, borderRadius: 8, border: 'none',
                fontSize: 12, cursor: 'pointer',
                background: page === p ? 'var(--brand-primary)' : 'transparent',
                color: page === p ? '#fff' : 'var(--text-tertiary)',
                fontWeight: page === p ? 700 : 400,
                fontFamily: 'inherit',
                transition: 'background 120ms',
              } as React.CSSProperties}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={pageBtn(page === totalPages)}
          >
            <ChevronRightIcon size={13} />
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 2 }}>
            {page} / {totalPages} 페이지
          </span>
        </div>

        {/* Action buttons — right side */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {isLpSummary ? (
            <ActionBtn label="Upload" icon={<Upload size={13} />} />
          ) : (
            <>
              <ActionBtn label="Download" icon={<Download size={13} />} />
              <ActionBtn label="Upload"   icon={<Upload size={13} />} />
              <div style={{ width: 1, height: 20, background: 'var(--border-primary)', margin: '0 2px' }} />
              <ActionBtn label="첨부 파일" icon={<Paperclip size={13} />} onClick={() => setAttachOpen(true)} />
              <div style={{ width: 1, height: 20, background: 'var(--border-primary)', margin: '0 2px' }} />
              <ActionBtn label="Save"     icon={<Save size={13} />}     primary />
            </>
          )}
        </div>
      </div>

      {attachOpen && (
        <AttachmentModal onClose={() => setAttachOpen(false)} isDark={isDark} />
      )}
      {reportAsmDsPopupRow && (
        <ReportAssemblyDsPopup
          row={reportAsmDsPopupRow}
          onClose={() => setReportAsmDsPopupRow(null)}
          isDark={isDark}
        />
      )}
    </div>
  );
}

function pageBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 28, height: 28,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 8, border: 'none', background: 'transparent',
    color: disabled ? 'var(--border-primary)' : 'var(--text-tertiary)',
    cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit',
  };
}

function ReportAssemblyDsPopup({
  row, onClose, isDark,
}: {
  row: ReportAssemblyRow;
  onClose: () => void;
  isDark: boolean;
}) {
  const bdr = 'var(--border-primary)';
  const TH: React.CSSProperties = {
    padding: '8px 12px', fontSize: 11.5, fontWeight: 700,
    background: isDark ? 'rgba(0,176,80,0.12)' : '#e6f7ee',
    color: '#00B050', borderBottom: `1px solid ${bdr}`,
    borderRight: `1px solid ${bdr}`, whiteSpace: 'nowrap', textAlign: 'left',
  };
  const TD: React.CSSProperties = {
    padding: '8px 12px', fontSize: 12.5,
    color: 'var(--text-primary)', borderBottom: `1px solid ${bdr}`,
    borderRight: `1px solid ${bdr}`, whiteSpace: 'nowrap',
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)',
        }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999, minWidth: 480,
        background: 'var(--surface-bg)',
        border: `1px solid ${bdr}`,
        borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px',
          background: isDark ? 'rgba(0,176,80,0.10)' : '#f0faf4',
          borderBottom: `1px solid ${bdr}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ZoomIn size={16} style={{ color: '#00B050' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>DS 추적</span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', display: 'flex', padding: 2, borderRadius: 6,
          }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '16px 18px 20px' }}>
          {row.dsLots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: 13 }}>
              DS LOT 정보가 없습니다.
            </div>
          ) : (
            <table style={{ borderCollapse: 'collapse', width: '100%', border: `1px solid ${bdr}`, borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr>
                  {['Process', 'Product', 'Batch No', '제형', '국가', 'Pack', '공정', 'DS LOT'].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {row.dsLots.map((lot, i) => (
                  <tr key={i}>
                    <td style={TD}>{lot.process}</td>
                    <td style={TD}>{lot.product}</td>
                    <td style={TD}>{lot.batchNo}</td>
                    <td style={TD}>{row.formulation || '-'}</td>
                    <td style={TD}>{row.country || '-'}</td>
                    <td style={TD}>{row.pack || '-'}</td>
                    <td style={TD}>{row.step || '-'}</td>
                    <td style={{ ...TD, borderRight: 'none', fontWeight: 600, color: '#00B050' }}>{lot.dsLot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

interface AttachedFile { id: string; name: string; size: string; date: string }

const INIT_FILES: AttachedFile[] = [
  { id: '1', name: '26년 3월 FCST 파일.PDF', size: '1.2 MB', date: '2026.03.01' },
  { id: '2', name: '26년 4월 FCST 파일.PDF', size: '980 KB', date: '2026.04.02' },
];

function AttachmentModal({ onClose, isDark }: { onClose: () => void; isDark: boolean }) {
  const [files, setFiles] = useState<AttachedFile[]>(INIT_FILES);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const added: AttachedFile[] = Array.from(newFiles).map(f => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size > 1024 * 1024
        ? `${(f.size / 1024 / 1024).toFixed(1)} MB`
        : `${Math.round(f.size / 1024)} KB`,
      date: new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .format(new Date()).replace(/\. /g, '.').replace('.', '').slice(0, 10),
    }));
    setFiles(prev => [...prev, ...added]);
  }, []);

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const surf = isDark ? '#1a2538' : '#ffffff';
  const bg = isDark ? '#111c2a' : '#f5f8f6';
  const bdr = isDark ? '#2a3a50' : '#d5dce6';
  const txt1 = isDark ? '#dce8f5' : '#1a2332';
  const txt2 = isDark ? '#7a9ab8' : '#4a5a6a';
  const txt3 = isDark ? '#4a6a88' : '#9aadbb';
  const dropBg = dragging
    ? (isDark ? '#0d2e1a' : '#e6f4ea')
    : (isDark ? '#151f2d' : '#f9fbfa');
  const dropBdr = dragging ? '#00B050' : bdr;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)',
        }}
      />

      <div style={{
        position: 'fixed', zIndex: 50,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 480, maxWidth: '95vw',
        background: surf,
        border: `1px solid ${bdr}`,
        borderRadius: 18,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        maxHeight: '80vh',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px 14px',
          borderBottom: `1px solid ${bdr}`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Paperclip size={17} color="#00B050" />
            <span style={{ fontSize: 15, fontWeight: 700, color: txt1 }}>첨부 파일</span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px',
              borderRadius: 20, background: '#00B050', color: '#fff',
            }}>{files.length}</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: txt3, display: 'flex', padding: 4, borderRadius: 8,
              transition: 'color 120ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = txt1)}
            onMouseLeave={e => (e.currentTarget.style.color = txt3)}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '16px 22px 0', flexShrink: 0 }}>
          <div
            style={{
              border: `2px dashed ${dropBdr}`,
              borderRadius: 12,
              background: dropBg,
              padding: '22px 16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              cursor: 'pointer',
              transition: 'border-color 180ms, background 180ms',
            }}
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          >
            <CloudUpload size={32} color={dragging ? '#00B050' : txt3} strokeWidth={1.5} />
            <span style={{ fontSize: 13, fontWeight: 600, color: dragging ? '#00B050' : txt2 }}>
              {dragging ? '파일을 놓으세요' : '클릭하거나 파일을 끌어다 놓으세요'}
            </span>
            <span style={{ fontSize: 11.5, color: txt3 }}>
              PDF, Excel, Word 등 모든 파일 형식 지원
            </span>
            <input
              ref={inputRef} type="file" multiple
              style={{ display: 'none' }}
              onChange={e => addFiles(e.target.files)}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 22px 20px' }}>
          {files.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: txt3, fontSize: 13 }}>
              첨부된 파일이 없습니다
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {files.map((f, idx) => (
                <div
                  key={f.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px',
                    background: bg,
                    border: `1px solid ${bdr}`,
                    borderRadius: 10,
                    transition: 'border-color 130ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#00B050')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = bdr)}
                >
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, color: txt3, minWidth: 18, textAlign: 'right',
                  }}>{idx + 1}.</span>

                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: isDark ? '#1e3a28' : '#e6f4ea',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {f.name.toLowerCase().endsWith('.pdf')
                      ? <FileText size={16} color="#00B050" />
                      : <File size={16} color="#00B050" />
                    }
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12.5, fontWeight: 600, color: txt1,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: txt3, marginTop: 1 }}>
                      {f.size} · {f.date}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFile(f.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: txt3, display: 'flex', padding: 4, borderRadius: 6,
                      flexShrink: 0, transition: 'color 120ms',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#e05252')}
                    onMouseLeave={e => (e.currentTarget.style.color = txt3)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          padding: '12px 22px', borderTop: `1px solid ${bdr}`,
          display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px', borderRadius: 10,
              border: `1px solid ${bdr}`, background: 'transparent',
              fontSize: 13, fontWeight: 600, color: txt2,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 140ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            닫기
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            style={{
              padding: '8px 20px', borderRadius: 10,
              border: 'none', background: '#00B050',
              fontSize: 13, fontWeight: 600, color: '#fff',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 140ms',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Upload size={13} /> 파일 추가
          </button>
        </div>
      </div>
    </>
  );
}