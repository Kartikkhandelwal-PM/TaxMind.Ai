import { Client, MockData, Message } from '../types';

export const mockClients: Client[] = [
  { id: 'c1', name: 'Tech Solutions Pvt Ltd', gstin: '27AAAAA1234A1Z5', pan: 'AAAAA1234A' },
  { id: 'c2', name: 'Global Traders LLP', gstin: '29BBBBB5678B1Z6', pan: 'BBBBB5678B' },
  { id: 'c3', name: 'Metro Manufacturing & Co.', gstin: '07CCCCC9012C1Z7', pan: 'CCCCC9012C' },
  { id: 'c4', name: 'Zodiac Export Imports', gstin: '24DDDDD3456D1Z8', pan: 'DDDDD3456D' },
  { id: 'c5', name: 'Pioneer Services Ltd', gstin: '33EEEEE7890E1Z9', pan: 'EEEEE7890E' },
];

export const clientMockData: Record<string, MockData> = {
  'c1': {
    booksAccounts: "Sales: ₹1,50,00,000, Purchases: ₹95,00,000, Expenses: ₹12,00,000 (FY 24-25).",
    filedReturns: "GSTR-1 (Apr-Feb) FILED, GSTR-3B (Apr-Jan) FILED. Annual Return GSTR-9 for FY 23-24 FILED.",
    pendingReturns: "GSTR-3B for February 2026 is PENDING. Due date is 20th March 2026.",
    notices: "None active. Notice u/s 61 resolved in Dec 2025.",
    taxLiability: "Q3 FY 25 Liability: CGST ₹4,50,000, SGST ₹4,50,000, IGST ₹12,00,000.",
    itc: "Eligible ITC available: CGST ₹3,20,000, SGST ₹3,20,000, IGST ₹8,50,000.",
    ledgerBalances: "Electronic Cash Ledger: CGST ₹10,000, SGST ₹10,000, IGST ₹5,000. Electronic Credit Ledger: Balance available.",
    reconciliation: "GSTR-2A vs Purchase Register matches completely for FY 24-25 Q1 to Q3. ₹25,000 discrepancy in Feb 2026.",
  },
  'c2': {
    booksAccounts: "Sales: ₹45,00,000, Purchases: ₹38,00,000 (FY 24-25).",
    filedReturns: "GSTR-1, GSTR-3B FILED up to Date.",
    pendingReturns: "No pending returns.",
    notices: "Active Notice: Under Section 61 for mismatch in GSTR-1 and 3B for FY 23-24. Reply due by 30th April 2026.",
    taxLiability: "Current quarter liability fully paid.",
    itc: "ITC Blocked u/s 17(5) for motor vehicle purchase: ₹45,000.",
    ledgerBalances: "Cash Ledger: Nil. Credit Ledger: CGST ₹40,000, SGST ₹40,000.",
    reconciliation: "Major mismatch of ₹1,20,000 in ITC claimed in 3B vs 2A for March 2025.",
  },
  'c3': {
    booksAccounts: "Sales: ₹8,00,00,000, Purchases: ₹6,50,00,000 (FY 24-25).",
    filedReturns: "GSTR-1 FILED, GSTR-3B FILED up to Jan 2026.",
    pendingReturns: "GSTR-1 and GSTR-3B for Feb 2026 are PENDING.",
    notices: "None.",
    taxLiability: "Jan 2026 Net Payable: ₹2,40,000. Expected Feb liability: ₹3,10,000.",
    itc: "Available ITC is ₹15,00,000.",
    ledgerBalances: "Huge Cash Ledger balance: ₹5,00,000. Credit Ledger: ₹18,00,000.",
    reconciliation: "GSTR-1 vs E-way bill reconciliation: ₹5,00,000 un-billed e-way bills found in Jan 2026.",
  },
  'c4': {
    booksAccounts: "Exports (LUT): ₹3,50,00,000, Domestic Sales: ₹20,00,000. Purchases & Imports: ₹2,10,00,000 (FY 24-25).",
    filedReturns: "GSTR-1 & GSTR-3B FILED up to Feb 2026. REFUND RFD-01 FILED for Q3.",
    pendingReturns: "GSTR-9 & 9C for FY 24-25 PENDING.",
    notices: "Query received on RFD-01 regarding shipping bill mismatch.",
    taxLiability: "Zero-rated supply primarily. Minor domestic liability of ₹36,000 (IGST) paid via ITC.",
    itc: "Accumulated ITC on account of exports: ₹18,50,000. Refund applied for ₹12,00,000.",
    ledgerBalances: "Cash Ledger: ₹500. Credit Ledger: ₹6,50,000.",
    reconciliation: "GSTR-2B matches purchase register 98%. Minor differences due to imported goods (IGST paid on customs not fully reflected in 2B).",
  },
  'c5': {
    booksAccounts: "Services rendered: ₹60,00,000. RCM liabilities on Freight & Advocate services: ₹1,20,000 (FY 24-25).",
    filedReturns: "GSTR-1 FILED. GSTR-3B FILED up to Dec 2025.",
    pendingReturns: "GSTR-3B for Jan & Feb 2026 PENDING. Late fees accumulating.",
    notices: "ASMT-10 received for FY 22-23 for ITC claim mismatch.",
    taxLiability: "RCM liability of ₹15,000 unpaid for Feb. Outward supply liability: ₹1,08,000.",
    itc: "Eligible ITC: ₹40,000.",
    ledgerBalances: "Cash Ledger: ₹2,000. Credit Ledger: ₹40,000.",
    reconciliation: "GSTR-2A shows ₹80,000 ITC but only ₹40,000 claimed as per 2B rules. Reconciliation complete.",
  }
};

export const initialExtensiveChat: Message[] = [
  {
    id: "m1",
    role: "user",
    content: "What is the status of GSTR-3B returns for Tech Solutions Pvt Ltd?",
    timestamp: "2026-04-22T06:10:00Z",
    type: "text",
  },
  {
    id: "m2",
    role: "assistant",
    content: "Based on the internal records:\n- **Filed Returns**: GSTR-3B filed from April 2025 to January 2026.\n- **Pending**: GSTR-3B for February 2026 is currently pending and due by March 20, 2026.",
    timestamp: "2026-04-22T06:10:05Z",
    type: "text"
  },
  {
    id: "m3",
    role: "user",
    content: "Voice note recorded",
    timestamp: "2026-04-22T06:12:30Z",
    type: "voice",
    voiceDuration: "0:14"
  },
  {
    id: "m4",
    role: "assistant",
    content: "Understood. Reconciling GSTR-2A against the purchase register for Q3 to spot the ₹25,000 discrepancy in Tech Solutions Pvt Ltd accounts. I will generate a reconciliation summary shortly.",
    timestamp: "2026-04-22T06:12:45Z",
    type: "text"
  },
  {
    id: "m5",
    role: "user",
    content: "Could you list out the ITC breakdown in a tabular view for my recent transactions?",
    timestamp: "2026-04-22T06:13:20Z",
    type: "text"
  },
  {
    id: "m6",
    role: "assistant",
    content: `Here is the ITC summary breakdown:\n| Category | Eligible ITC (₹) | Ineligible ITC (₹) | Total (₹) |\n| :--- | :--- | :--- | :--- |\n| **CGST** | 3,20,000 | 12,000 | 3,32,000 |\n| **SGST** | 3,20,000 | 12,000 | 3,32,000 |\n| **IGST** | 8,50,000 | 45,000 | 8,95,000 |\n| **Total** | **14,90,000** | **69,000** | **15,59,000** |\n\n_Note: Ineligible ITC primarily relates to blocked credits under Sec 17(5)_`,
    timestamp: "2026-04-22T06:13:40Z",
    type: "tabular"
  },
  {
    id: "m7",
    role: "user",
    content: "Has any ASMT-10 been issued for Tech Solutions?",
    timestamp: "2026-04-22T06:15:10Z",
    type: "text"
  },
  {
    id: "m8",
    role: "assistant",
    content: "Critical Tax Alert: I've cross-verified the portal. No active ASMT-10 exists for Tech Solutions Pvt Ltd. However, an earlier notice under Section 61 was issued and successfully resolved in December 2025. You are fully compliant as of today.",
    timestamp: "2026-04-22T06:15:35Z",
    type: "alert"
  },
  {
    id: "m9",
    role: "assistant",
    content: "You've exhausted your allocated API tokens for real-time GST portal sync. Further requests will rely on offline books cached until tomorrow. Upgrade to the Pro plan for continuous portal access.",
    timestamp: "2026-04-22T06:20:00Z",
    type: "limit"
  },
  {
    id: "m12",
    role: "user",
    content: "Generate a Draft reply for my mismatch in 3B and 2A.",
    timestamp: "2026-04-22T06:22:00Z",
    type: "text"
  },
  {
    id: "m13",
    role: "assistant",
    content: "To draft an accurate reply, I need a bit more context. Please select or provide the primary reason for the mismatch:",
    timestamp: "2026-04-22T06:22:05Z",
    type: "clarification"
  }
];

export const mockHistoryChats: Record<string, Message[]> = {
  '1': initialExtensiveChat,
  '2': [
    {
      id: "m20",
      role: "user",
      content: "Draft a formal reply for my recent Notice u/s 61 regarding mismatch in GSTR-1 and 3B.",
      timestamp: "2026-04-22T08:00:00Z",
      type: "text"
    },
    {
      id: "m21",
      role: "assistant",
      content: "Based on your active notices, I see a Section 61 notice for Global Traders LLP. To draft an accurate and legally sound reply, I need a bit more context. Please select or provide the primary reason for the mismatch:",
      timestamp: "2026-04-22T08:00:05Z",
      type: "clarification"
    },
    {
      id: "m22",
      role: "user",
      content: "Supplier delayed filing GSTR-1",
      timestamp: "2026-04-22T08:05:00Z",
      type: "text"
    },
    {
      id: "m23",
      role: "assistant",
      content: "Understood. I will generate a draft reply stating that the discrepancy is due to the supplier's delay in filing GSTR-1, and providing the relevant invoice details to substantiate the claim. \n\n### Download the prepared draft below:",
      timestamp: "2026-04-22T08:05:05Z",
      type: "text"
    }
  ],
  '3': [
    {
      id: "m30",
      role: "user",
      content: "Can you reconcile Q1 invoices for Metro Manufacturing?",
      timestamp: "2026-04-21T10:00:00Z",
      type: "voice",
      voiceDuration: "0:22"
    },
    {
      id: "m31",
      role: "assistant",
      content: "I have initialized the reconciliation engine for Metro Manufacturing & Co (Q1). Scanning 4,520 invoices against the GST portal...",
      timestamp: "2026-04-21T10:00:15Z",
      type: "text"
    },
    {
      id: "m32",
      role: "assistant",
      content: "Critical Tax Alert: The automated reconciliation found ₹5,00,000 worth of un-billed E-way bills in January 2026 that are not reflected in GSTR-1. This is a severe compliance risk that could trigger instant ASMT-10 or Section 73 proceedings.",
      timestamp: "2026-04-21T10:00:20Z",
      type: "alert"
    }
  ],
  '4': [
    {
      id: "m40",
      role: "user",
      content: "Show me the ITC mismatch analysis for Pioneer Services over the last 7 days. I want to pull all line items directly from the government registry.",
      timestamp: "2026-04-18T14:20:00Z",
      type: "text"
    },
    {
      id: "m41",
      role: "assistant",
      content: "You've completely exhausted your allocated API tokens for real-time GST portal sync this billing cycle. Further deep-registry requests are blocked. You can still query cached data or upgrade your plan to restore real-time portal access.",
      timestamp: "2026-04-18T14:20:05Z",
      type: "limit"
    }
  ],
  '5': [
    {
      id: "m50",
      role: "user",
      content: "What is the capital of France and how do I make a cake?",
      timestamp: "2026-04-17T11:00:00Z",
      type: "text"
    },
    {
      id: "m51",
      role: "assistant",
      content: "I am TaxMind AI, completely specialized in Indian Taxation, GST compliance, and financial auditing. I am restricted from answering questions outside of this scope (such as geography or recipes) to ensure accuracy and limit liability.",
      timestamp: "2026-04-17T11:00:05Z",
      type: "irrelevant"
    }
  ],
  '6': [
    {
      id: "m60",
      role: "user",
      content: "Show me the depreciation schedule for the new generators we bought for the plant in Jan.",
      timestamp: "2026-03-24T09:12:00Z",
      type: "text"
    },
    {
      id: "m61",
      role: "assistant",
      content: "Here is the projected depreciation schedule for Capital Goods under the Income Tax Act (15% block) and Companies Act.\n\n| Year | Opening WDV | Depreciation @ 15% | Closing WDV |\n|---|---|---|---|\n| FY25 | ₹10,00,000 | ₹1,50,000 | ₹8,50,000 |\n| FY26 | ₹8,50,000 | ₹1,27,500 | ₹7,22,500 |\n| FY27 | ₹7,22,500 | ₹1,08,375 | ₹6,14,125 |\n\nNote: If the asset was put to use for less than 180 days in the year of acquisition, the depreciation rate is halved (7.5%) for that first year.",
      timestamp: "2026-03-24T09:12:10Z",
      type: "tabular"
    }
  ]
};
