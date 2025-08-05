import crypto from "crypto";

export interface VNPayConfig {
  vnp_TmnCode: string;
  vnp_HashSecret: string;
  vnp_Url: string;
  vnp_ReturnUrl: string;
}

export interface VNPayPaymentData {
  amount: number;
  orderId: string;
  orderInfo: string;
  orderType: string;
  locale?: string;
  currCode?: string;
  vnp_Command?: string;
  vnp_CreateDate?: string;
  vnp_IpAddr?: string;
}

export interface VNPayCallbackData {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}

export class VNPayService {
  private config: VNPayConfig;

  constructor(config: VNPayConfig) {
    this.config = config;
  }

  /**
   * Tạo URL thanh toán VNPay
   */
  createPaymentUrl(data: VNPayPaymentData): string {
    const date = new Date();
    const createDate = date.toISOString().slice(0, 8).replace(/-/g, "");

    const vnpParams: Record<string, string> = {
      vnp_Version: "2.1.0",
      vnp_Command: data.vnp_Command || "pay",
      vnp_TmnCode: this.config.vnp_TmnCode,
      vnp_Amount: (data.amount * 100).toString(), // VNPay yêu cầu số tiền nhân với 100
      vnp_CurrCode: data.currCode || "VND",
      vnp_BankCode: "",
      vnp_TxnRef: data.orderId,
      vnp_OrderInfo: data.orderInfo,
      vnp_OrderType: data.orderType,
      vnp_Locale: data.locale || "vn",
      vnp_ReturnUrl: this.config.vnp_ReturnUrl,
      vnp_IpAddr: data.vnp_IpAddr || "127.0.0.1", // TODO: Lấy IP từ request
      vnp_CreateDate: data.vnp_CreateDate || createDate,
    };

    // Sắp xếp các tham số theo thứ tự alphabet
    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((result: Record<string, string>, key) => {
        if (vnpParams[key] !== "" && vnpParams[key] !== null) {
          result[key] = vnpParams[key];
        }
        return result;
      }, {});

    // Tạo chuỗi query string
    const queryString = Object.keys(sortedParams)
      .map((key) => `${key}=${encodeURIComponent(sortedParams[key])}`)
      .join("&");

    // Tạo chữ ký
    const signData = queryString;
    const hmac = crypto.createHmac("sha512", this.config.vnp_HashSecret);
    const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    // Thêm chữ ký vào URL
    const paymentUrl = `${this.config.vnp_Url}?${queryString}&vnp_SecureHash=${signed}`;

    return paymentUrl;
  }

  /**
   * Xác thực callback từ VNPay
   */
  verifyCallback(callbackData: VNPayCallbackData): boolean {
    // Loại bỏ vnp_SecureHash và vnp_SecureHashType khỏi dữ liệu để tạo chữ ký
    const { vnp_SecureHash, ...dataToVerify } = callbackData;

    // Sắp xếp các tham số theo thứ tự alphabet
    const sortedParams = Object.keys(dataToVerify)
      .sort()
      .reduce((result: Record<string, string>, key) => {
        if (
          dataToVerify[key as keyof typeof dataToVerify] !== "" &&
          dataToVerify[key as keyof typeof dataToVerify] !== null
        ) {
          result[key] = dataToVerify[key as keyof typeof dataToVerify];
        }
        return result;
      }, {});

    // Tạo chuỗi query string
    const queryString = Object.keys(sortedParams)
      .map((key) => `${key}=${encodeURIComponent(sortedParams[key])}`)
      .join("&");

    // Tạo chữ ký
    const signData = queryString;
    const hmac = crypto.createHmac("sha512", this.config.vnp_HashSecret);
    const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    // So sánh chữ ký
    return signed === vnp_SecureHash;
  }

  /**
   * Kiểm tra trạng thái thanh toán
   */
  checkPaymentStatus(responseCode: string): {
    success: boolean;
    message: string;
  } {
    switch (responseCode) {
      case "00":
        return {
          success: true,
          message: "Giao dịch thành công",
        };
      case "24":
        return {
          success: false,
          message: "Khách hàng hủy giao dịch",
        };
      case "51":
        return {
          success: false,
          message: "Tài khoản không đủ số dư",
        };
      case "65":
        return {
          success: false,
          message: "Tài khoản đã bị khóa",
        };
      case "75":
        return {
          success: false,
          message: "Ngân hàng đang bảo trì",
        };
      case "79":
        return {
          success: false,
          message: "Khách hàng nhập sai mật khẩu quá số lần quy định",
        };
      case "99":
        return {
          success: false,
          message: "Các lỗi khác",
        };
      default:
        return {
          success: false,
          message: "Giao dịch thất bại",
        };
    }
  }
}

// Khởi tạo VNPay service với config từ environment variables
export const vnpayService = new VNPayService({
  vnp_TmnCode: process.env.VNPAY_TMN_CODE || "",
  vnp_HashSecret: process.env.VNPAY_HASH_SECRET || "",
  vnp_Url:
    process.env.VNPAY_URL ||
    "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_ReturnUrl:
    process.env.VNPAY_RETURN_URL ||
    "http://localhost:3000/api/payment/vnpay/callback",
});
