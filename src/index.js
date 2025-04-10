import './index.scss';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

const addTableColumn = (reportTableData) => {
    if ('orders' !== reportTableData.endpoint) {
        return reportTableData;
    }

    const newHeaders = [
        ...reportTableData.headers,
        { label: __('Payment Method', 'woocommerce-custom-column-analytics'), key: 'payment_method' },
        { label: __('Customer Email', 'woocommerce-custom-column-analytics'), key: 'customer_email' },
        { label: __('Customer Phone', 'woocommerce-custom-column-analytics'), key: 'customer_phone' },
        { label: __('Customer Address', 'woocommerce-custom-column-analytics'), key: 'customer_address' },
    ];

    const newRows = reportTableData.rows.map((row, index) => {
        const item = reportTableData.items.data[index];

        return [
            ...row,
            { display: item.payment_method || __('N/A'), value: item.payment_method || '' },
            { display: item.customer_email || __('N/A'), value: item.customer_email || '' },
            { display: item.customer_phone || __('N/A'), value: item.customer_phone || '' },
            { display: item.customer_address || __('N/A'), value: item.customer_address || '' },
        ];
    });

    reportTableData.headers = newHeaders;
    reportTableData.rows = newRows;

    return reportTableData;
};

addFilter('woocommerce_admin_report_table', 'woocommerce-custom-column-analytics', addTableColumn);
