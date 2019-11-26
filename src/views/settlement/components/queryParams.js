// 新增提交
export const addDocumentParams = {

  'currency': '',
  'documentCode': '',
  'documentId': '',
  'documentName': '',
  'remark': '',
  'documentType': 0,
  'documentWaybillMapParamVoList': [
    // {
    //   'documentId': 'string',
    //   'partnerId': 'string',
    //   'settlementMoney': 0,
    //   'tunedRemark': 'string',
    //   'tunedTotalMoney': 0,
    //   'waybillId': 'string'
    // }
  ],
  'isInvoice': 0,
  'partnerId': '1111',
  'partnerName': '22222',
  'payMothod': 0,
  'payPeriod': 0,
  'paymentSaveVo': {
    'documentId': '',
    'invoiceVo': [
      {
        'documentId': '',
        'paidMoney': 0,
        'payDate': '',
        'payMoney': 0,
        'payMothod': 0,
        'payRemark': '',
        'payUrl': '',
        'payee': '',
        'payeeBankId': 0,
        'payeeCompany': '',
        'payerAccount': ''
      }
    ],
    'soucementDocumentPicVoList': [
      {
        'documentId': '',
        'documentUrl': '',
        'picId': ''
      }
    ]
  },
  'reqInvoiceDate': '',
  'settlementNow': false,
  'settlementObjectType': 0,
  'settlementPeriod': '',
  'settlementType': 111,
  'taxInclude': 0,
  'taxRate': 0,
  'totalMoney': 3.11
}
// 请求客户协同结算单 coordinateModal
export const coordinatelistParams = {
  'documentCode': '',
  'documentId': '',
  'documentName': '',
  'objectType': '1',
  'onlineSettlementStatus': '1',
  'page': '1',
  'pageSize': '10',
  'partnerId': '',
  'settlementStatus': '300',
  'settlementType': ''
}
