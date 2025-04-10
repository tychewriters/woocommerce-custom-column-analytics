<?php
/**
 * Plugin Name: woocommerce-custom-column-analytics
 *
 * @package WooCommerce\Admin
 */

/**
 * Register the JS and CSS.
 */
function add_extension_register_script() {
    if ( ! class_exists( 'Automattic\WooCommerce\Admin\PageController' ) || ! \Automattic\WooCommerce\Admin\PageController::is_admin_or_embed_page() ) {
        return;
    }

    $script_path = '/build/index.js';
    $script_asset_path = dirname( __FILE__ ) . '/build/index.asset.php';
    $script_asset = file_exists( $script_asset_path ) ? require( $script_asset_path ) : array( 'dependencies' => array(), 'version' => filemtime( $script_path ) );
    $script_url = plugins_url( $script_path, __FILE__ );

    wp_register_script(
        'woocommerce-custom-column-analytics',
        $script_url,
        $script_asset['dependencies'],
        $script_asset['version'],
        true
    );

    wp_register_style(
        'woocommerce-custom-column-analytics',
        plugins_url( '/build/style.css', __FILE__ ),
        array(),
        filemtime( dirname( __FILE__ ) . '/build/style.css' )
    );

    wp_enqueue_script( 'woocommerce-custom-column-analytics' );
    wp_enqueue_style( 'woocommerce-custom-column-analytics' );
}
add_action( 'admin_enqueue_scripts', 'add_extension_register_script' );

/**
 * Add extra data to WooCommerce Analytics Orders report.
 */
add_filter('woocommerce_analytics_orders_select_query', function ($results, $args) {
    if ($results && isset($results->data) && !empty($results->data)) {
        foreach ($results->data as $key => $result) {
            $order = wc_get_order($result['order_id']);

            if ($order) {
                $results->data[$key]['payment_method']   = $order->get_payment_method_title();
                $results->data[$key]['customer_email']   = $order->get_billing_email();
                $results->data[$key]['customer_phone']   = $order->get_billing_phone();

                // Clean, comma-separated address
                $address_parts = [
                    $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
                    $order->get_billing_address_1(),
                    $order->get_billing_address_2(),
                    $order->get_billing_city(),
                    $order->get_billing_postcode(),
                    $order->get_billing_state(),
                    $order->get_billing_country(),
                ];
                $clean_address = implode(', ', array_filter($address_parts));
                $results->data[$key]['customer_address'] = $clean_address;
            }
        }
    }

    return $results;
}, 10, 2);

/**
 * Add new columns to CSV export.
 */
add_filter('woocommerce_report_orders_export_columns', function ($export_columns){
    $export_columns['payment_method']    = 'Payment Method';
    $export_columns['customer_email']    = 'Customer Email';
    $export_columns['customer_phone']    = 'Customer Phone';
    $export_columns['customer_address']  = 'Customer Address';
    return $export_columns;
});
