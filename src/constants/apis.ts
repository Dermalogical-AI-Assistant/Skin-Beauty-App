// AUTH
export const REQUEST_lOGIN = "/auth/login";
export const REQUEST_REFRESH = "/auth/refresh";
export const REQUEST_GET_MY_PROFILE = "/auth/self/my-profile"
export const REQUEST_REGISTER_ACCOUNT = "/auth/local/sign-up";
export const REQUEST_LOGOUT = "/auth/logout";
export const REQUEST_USERS_MODULE = "/auth/users"

// SKIN ANALYSIS
export const REQUEST_SKIN_ANALYSIS_PREDICT = "/skin-analysis/predict"
export const REQUEST_FILES_MODULE = "/files"
export const REQUEST_MY_ANALYSIS_HISTORY = "/skin-analysis/history";

// CHATBOT
// SESSIONS
export const REQUEST_CHATBOT_SESSIONS = "/qa/my-sessions";
export const REQUEST_RENAME_CHATBOT_SESSION = "/qachat/sessions";
export const REQUEST_DELETE_CHATBOT_SESSION = "/qa/sessions";
export const REQUEST_DELETE_ALL_CHATBOT_SESSION = "/qa/my-sessions";
export const REQUEST_NEW_CHATBOT_SESSION = "/qa/sessions";
// MESSAGES
export const REQUEST_CHATBOT_MESSAGES = "/qa/messages";
export const REQUEST_MONTHLY_CRAWL_COUNT = "/qa/urls-monthly";

//SHOP
export const REQUEST_PRODUCTS = "/eco/products";
export const REQUEST_SKINCONCERN = "/eco/skincare_concerns";
export const REQUEST_ADD_PRODUCT_TO_CART = "/eco/cart-items";

export const REQUEST_CREATE_ORDER = "/eco/order-items";
export const REQUEST_MY_ORDERS = "/eco/my-orders";
export const REQUEST_ORDERS = "/eco/orders";
export const REQUEST_ORDER_DETAIL = "/eco/orders";
export const REQUEST_UPDATE_ORDER = "/eco/orders";

export const REQUEST_MY_SHIPPING_ADDRESS = "/eco/my-shipping-addresses";
export const REQUEST_CREATE_SHIPPING_ADDRESS = "/eco/shipping-addresses";

export const REQUEST_COMMENTS = "/eco/comments-product";
export const REQUEST_CREATE_COMMENT = "/eco/comments";

//STORAGE
export const REQUEST_UPLOAD_FILE = "/storage/upload/image";

// PRODUCTS
// ADMIN
export const REQUEST_ADMIN_PRODUCTS = "/eco/admin/products";
export const REQUEST_CREATE_PRODUCT = "/eco/products";
export const REQUEST_DELETE_PRODUCT = "/eco/products";

export const REQUEST_ADMIN_CREATE_DISCOUNTS = "/eco/discounts";
export const REQUEST_ADMIN_DISCOUNTS = "/eco/discounts";
export const REQUEST_ADMIN_DISCOUNT_DETAIL = "/eco/discounts";
export const REQUEST_DELETE_DISCOUNT = "/eco/discounts";

//Dashboard
export const REQUEST_MONTHLY_SALES = "/eco/sales-monthly";
export const REQUEST_MONTHLY_ORDERS = "/eco/orders-monthly";
export const REQUEST_NEW_CUSTOMER_COUNT = "/auth/new-customers-count";
export const REQUEST_ORDER_COUNT = "/eco/orders-count";
export const REQUEST_PERIODICAL_REVENUES = "/eco/periodical-revenues";
