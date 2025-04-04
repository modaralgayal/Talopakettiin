<?php
/**
 * Theme functions and definitions
 *
 * @package HelloElementor
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'HELLO_ELEMENTOR_VERSION', '3.2.1' );

if ( ! isset( $content_width ) ) {
	$content_width = 800; // Pixels.
}

if ( ! function_exists( 'hello_elementor_setup' ) ) {
	/**
	 * Set up theme support.
	 *
	 * @return void
	 */
	function hello_elementor_setup() {
		if ( is_admin() ) {
			hello_maybe_update_theme_version_in_db();
		}

		if ( apply_filters( 'hello_elementor_register_menus', true ) ) {
			register_nav_menus( [ 'menu-1' => esc_html__( 'Header', 'hello-elementor' ) ] );
			register_nav_menus( [ 'menu-2' => esc_html__( 'Footer', 'hello-elementor' ) ] );
		}

		if ( apply_filters( 'hello_elementor_post_type_support', true ) ) {
			add_post_type_support( 'page', 'excerpt' );
		}

		if ( apply_filters( 'hello_elementor_add_theme_support', true ) ) {
			add_theme_support( 'post-thumbnails' );
			add_theme_support( 'automatic-feed-links' );
			add_theme_support( 'title-tag' );
			add_theme_support(
				'html5',
				[
					'search-form',
					'comment-form',
					'comment-list',
					'gallery',
					'caption',
					'script',
					'style',
				]
			);
			add_theme_support(
				'custom-logo',
				[
					'height'      => 100,
					'width'       => 350,
					'flex-height' => true,
					'flex-width'  => true,
				]
			);
			add_theme_support( 'align-wide' );
			add_theme_support( 'responsive-embeds' );

			/*
			 * Editor Styles
			 */
			add_theme_support( 'editor-styles' );
			add_editor_style( 'editor-styles.css' );

			/*
			 * WooCommerce.
			 */
			if ( apply_filters( 'hello_elementor_add_woocommerce_support', true ) ) {
				// WooCommerce in general.
				add_theme_support( 'woocommerce' );
				// Enabling WooCommerce product gallery features (are off by default since WC 3.0.0).
				// zoom.
				add_theme_support( 'wc-product-gallery-zoom' );
				// lightbox.
				add_theme_support( 'wc-product-gallery-lightbox' );
				// swipe.
				add_theme_support( 'wc-product-gallery-slider' );
			}
		}
	}
}
add_action( 'after_setup_theme', 'hello_elementor_setup' );

function hello_maybe_update_theme_version_in_db() {
	$theme_version_option_name = 'hello_theme_version';
	// The theme version saved in the database.
	$hello_theme_db_version = get_option( $theme_version_option_name );

	// If the 'hello_theme_version' option does not exist in the DB, or the version needs to be updated, do the update.
	if ( ! $hello_theme_db_version || version_compare( $hello_theme_db_version, HELLO_ELEMENTOR_VERSION, '<' ) ) {
		update_option( $theme_version_option_name, HELLO_ELEMENTOR_VERSION );
	}
}

if ( ! function_exists( 'hello_elementor_display_header_footer' ) ) {
	/**
	 * Check whether to display header footer.
	 *
	 * @return bool
	 */
	function hello_elementor_display_header_footer() {
		$hello_elementor_header_footer = true;

		return apply_filters( 'hello_elementor_header_footer', $hello_elementor_header_footer );
	}
}

if ( ! function_exists( 'hello_elementor_scripts_styles' ) ) {
	/**
	 * Theme Scripts & Styles.
	 *
	 * @return void
	 */
	function hello_elementor_scripts_styles() {
		$min_suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		if ( apply_filters( 'hello_elementor_enqueue_style', true ) ) {
			wp_enqueue_style(
				'hello-elementor',
				get_template_directory_uri() . '/style' . $min_suffix . '.css',
				[],
				HELLO_ELEMENTOR_VERSION
			);
		}

		if ( apply_filters( 'hello_elementor_enqueue_theme_style', true ) ) {
			wp_enqueue_style(
				'hello-elementor-theme-style',
				get_template_directory_uri() . '/theme' . $min_suffix . '.css',
				[],
				HELLO_ELEMENTOR_VERSION
			);
		}

		if ( hello_elementor_display_header_footer() ) {
			wp_enqueue_style(
				'hello-elementor-header-footer',
				get_template_directory_uri() . '/header-footer' . $min_suffix . '.css',
				[],
				HELLO_ELEMENTOR_VERSION
			);
		}
	}
}
add_action( 'wp_enqueue_scripts', 'hello_elementor_scripts_styles' );

if ( ! function_exists( 'hello_elementor_register_elementor_locations' ) ) {
	/**
	 * Register Elementor Locations.
	 *
	 * @param ElementorPro\Modules\ThemeBuilder\Classes\Locations_Manager $elementor_theme_manager theme manager.
	 *
	 * @return void
	 */
	function hello_elementor_register_elementor_locations( $elementor_theme_manager ) {
		if ( apply_filters( 'hello_elementor_register_elementor_locations', true ) ) {
			$elementor_theme_manager->register_all_core_location();
		}
	}
}
add_action( 'elementor/theme/register_locations', 'hello_elementor_register_elementor_locations' );

if ( ! function_exists( 'hello_elementor_content_width' ) ) {
	/**
	 * Set default content width.
	 *
	 * @return void
	 */
	function hello_elementor_content_width() {
		$GLOBALS['content_width'] = apply_filters( 'hello_elementor_content_width', 800 );
	}
}
add_action( 'after_setup_theme', 'hello_elementor_content_width', 0 );

if ( ! function_exists( 'hello_elementor_add_description_meta_tag' ) ) {
	/**
	 * Add description meta tag with excerpt text.
	 *
	 * @return void
	 */
	function hello_elementor_add_description_meta_tag() {
		if ( ! apply_filters( 'hello_elementor_description_meta_tag', true ) ) {
			return;
		}

		if ( ! is_singular() ) {
			return;
		}

		$post = get_queried_object();
		if ( empty( $post->post_excerpt ) ) {
			return;
		}

		echo '<meta name="description" content="' . esc_attr( wp_strip_all_tags( $post->post_excerpt ) ) . '">' . "\n";
	}
}
add_action( 'wp_head', 'hello_elementor_add_description_meta_tag' );

// Admin notice
if ( is_admin() ) {
	require get_template_directory() . '/includes/admin-functions.php';
}

// Settings page
require get_template_directory() . '/includes/settings-functions.php';

// Header & footer styling option, inside Elementor
require get_template_directory() . '/includes/elementor-functions.php';

if ( ! function_exists( 'hello_elementor_customizer' ) ) {
	// Customizer controls
	function hello_elementor_customizer() {
		if ( ! is_customize_preview() ) {
			return;
		}

		if ( ! hello_elementor_display_header_footer() ) {
			return;
		}

		require get_template_directory() . '/includes/customizer-functions.php';
	}
}
add_action( 'init', 'hello_elementor_customizer' );

if ( ! function_exists( 'hello_elementor_check_hide_title' ) ) {
	/**
	 * Check whether to display the page title.
	 *
	 * @param bool $val default value.
	 *
	 * @return bool
	 */
	function hello_elementor_check_hide_title( $val ) {
		if ( defined( 'ELEMENTOR_VERSION' ) ) {
			$current_doc = Elementor\Plugin::instance()->documents->get( get_the_ID() );
			if ( $current_doc && 'yes' === $current_doc->get_settings( 'hide_title' ) ) {
				$val = false;
			}
		}
		return $val;
	}
}
add_filter( 'hello_elementor_page_title', 'hello_elementor_check_hide_title' );

/**
 * BC:
 * In v2.7.0 the theme removed the `hello_elementor_body_open()` from `header.php` replacing it with `wp_body_open()`.
 * The following code prevents fatal errors in child themes that still use this function.
 */
if ( ! function_exists( 'hello_elementor_body_open' ) ) {
	function hello_elementor_body_open() {
		wp_body_open();
	}
}

function enqueue_application_scripts() {
    wp_enqueue_script(
        'applications-script',
        get_template_directory_uri() . '/js/applications.js', // Path to your JavaScript file
        ['jquery'],
        null,
        true
    );

    wp_localize_script(
        'applications-script',
        'ajax_object',
        [
            'ajax_url' => admin_url('admin-ajax.php') // Automatically generates the correct URL
        ]
    );
}
add_action('wp_enqueue_scripts', 'enqueue_application_scripts');



add_action('wp_ajax_get_custom_shortcode', 'handle_get_custom_shortcode');
add_action('wp_ajax_nopriv_get_custom_shortcode', 'handle_get_custom_shortcode');

function handle_get_custom_shortcode() {
    // Get the token and usertype cookie values
    error_log("Handling shortcodes");
    $token = isset($_COOKIE['token']) ? sanitize_text_field($_COOKIE['token']) : null;
    $usertype = isset($_COOKIE['usertype']) ? sanitize_text_field($_COOKIE['usertype']) : null;

    // Determine the response based on the token and usertype
    if ($token) {
        if ($usertype === 'provider') {
			error_log("Found provider");
            $response = do_shortcode('[hfe_template id="1316"]');
        } elseif ($usertype === 'customer') {
			error_log("Found Customer");
            $response = do_shortcode('[hfe_template id="1273"]');
        } else {
			error_log("Could not find usertype");
            $response = do_shortcode('[hfe_template id="1278"]');
        }
    } else {
		error_log("Token not found so defaulting header");
        $response = do_shortcode('[hfe_template id="1278"]');
    }

    // Send the response
    if ($response) {
        wp_send_json_success($response); // Send the generated shortcode content
    } else {
        wp_send_json_error(['message' => 'Failed to generate shortcode content']);
    }
}


// Enqueue scripts for custom_shortcode
function enqueue_custom_shortcode_scripts() {
    wp_enqueue_script(
        'custom-shortcode-script',
        get_template_directory_uri() . '/js/custom-shortcode.js', // Path to your JavaScript file
        ['jquery'],
        null,
        true
    );

    wp_localize_script(
        'custom-shortcode-script',
        'custom_shortcode_ajax',
        [
            'ajax_url' => admin_url('admin-ajax.php') // Automatically generates the correct URL
        ]
    );
}
add_action('wp_enqueue_scripts', 'enqueue_custom_shortcode_scripts');

function capture_form_id_as_json($fields, $entry, $form_data, $entry_Id) {
    error_log('Form submission received.');

    // Extract token from cookie
    $token = isset($_COOKIE['token']) ? $_COOKIE['token'] : 'token not found';
    error_log("Extracted token: " . $token);

    // Handle Form ID 1587
    if ($form_data['id'] == 1587) {
        error_log('Handling form ID 1587.');
        $entryIdFromUrl = null;

        // Extract entryId from page_url if available
        if (isset($form_data['entry_meta']['page_url'])) {
            $page_url = $form_data['entry_meta']['page_url'];
            error_log("Found page_url: " . $page_url);

            $parsed_url = parse_url($page_url);
            if (isset($parsed_url['query'])) {
                parse_str($parsed_url['query'], $query_params);
                if (isset($query_params['entryId'])) {
                    $entryIdFromUrl = intval($query_params['entryId']);
                    error_log("Found entryId in URL: " . $entryIdFromUrl);
                } else {
                    error_log("No entryId found in URL.");
                }
            } else {
                error_log("No query string found in URL.");
            }
        }

        // Prepare new WPForms entry
        $new_entry_data = [
            'form_data' => $form_data,
            'fields'    => [],
        ];

        foreach ($fields as $field) {
            if (isset($field['id']) && isset($field['value'])) {
                $new_entry_data['fields'][$field['id']] = $field['value'];
            }
        }

        // Create the new entry
        $new_entry = wpforms()->entry->add($new_entry_data);
        if ($new_entry) {
            error_log("Successfully created new entry with ID: " . $new_entry);
        } else {
            error_log("Failed to create new entry.");
        }

        // Send data to external API
        $entry_type = 'offer';
		
        $json_data = json_encode(['offerId' => $entry_Id, 'entryId' => $entryIdFromUrl, 'entryType' => $entry_type]);
        error_log('Sending entryId: ' . $entry_Id);

        $api_url = 'https://serverapi.talopakettiin.fi/api/forms/receive-form-data';
        $response = wp_remote_post($api_url, [
            'method'    => 'POST',
            'body'      => $json_data,
            'headers'   => [
                'Content-Type'  => 'application/json',
                'token'         => $token,
            ],
        ]);

        if (is_wp_error($response)) {
            error_log('Error: ' . $response->get_error_message());
        } else {
            error_log("Response Status Code: " . wp_remote_retrieve_response_code($response));
            error_log("Response Body: " . wp_remote_retrieve_body($response));
        }
    } 
    
    // Handle Form ID 613
    else if ($form_data['id'] == 613) {
        error_log('Handling form ID 613.');

        // Initialize entryIdFromUrl as null
        $entryIdFromUrl = null;
		global $wpdb;

        // Check if 'page_url' exists in the entry_meta and extract the entryId from the URL
        if (isset($form_data['entry_meta']['page_url'])) {
            $page_url = $form_data['entry_meta']['page_url'];
            error_log("Found page_url: " . $page_url);

            // Parse the URL and extract the 'entryId' from the query string
            $parsed_url = parse_url($page_url);
            if (isset($parsed_url['query'])) {
                parse_str($parsed_url['query'], $query_params);
                if (isset($query_params['entryId'])) {
                    $entryIdFromUrl = intval($query_params['entryId']); // Extract and sanitize entryId
                    error_log("Found entryId in URL: " . $entryIdFromUrl);
                } else {
                    error_log("No entryId found in URL.");
                }
            } else {
                error_log("No query string found in URL.");
            }
        } else {
            error_log("No page_url found in entry_meta.");
        }

        // Delete the existing entry using raw SQL queries if entryIdFromUrl is valid
        if ($entryIdFromUrl) {
            error_log("Deleting existing entry with ID: " . $entryIdFromUrl);

            // Delete from wpforms_entry_meta
            $meta_table = $wpdb->prefix . 'wpforms_entry_meta';
            $meta_delete_result = $wpdb->query(
                $wpdb->prepare(
                    "DELETE FROM $meta_table WHERE entry_id = %d",
                    $entryIdFromUrl
                )
            );

            if ($meta_delete_result !== false) {
                error_log("Successfully deleted meta for entry ID: " . $entryIdFromUrl);
            } else {
                error_log("Failed to delete meta for entry ID: " . $entryIdFromUrl . ". SQL Error: " . $wpdb->last_error);
            }

            // Delete from wpforms_entries
            $entries_table = $wpdb->prefix . 'wpforms_entries';
            $entry_delete_result = $wpdb->query(
                $wpdb->prepare(
                    "DELETE FROM $entries_table WHERE entry_id = %d",
                    $entryIdFromUrl
                )
            );

            if ($entry_delete_result !== false) {
                error_log("Successfully deleted entry ID: " . $entryIdFromUrl);
            } else {
                error_log("Failed to delete entry ID: " . $entryIdFromUrl . ". SQL Error: " . $wpdb->last_error);
            }

            // Prepare the data for the external API request
            $api_url = 'https://serverapi.talopakettiin.fi/api/forms/delete-user-entry';
            $body = json_encode([ 'entryIdToDelete' => $entryIdFromUrl ]);
            $token = isset($_COOKIE['token']) ? $_COOKIE['token'] : 'token not found';

            // Send the deletion request to the external API
            $response = wp_remote_post($api_url, [
                'method'    => 'POST',
                'body'      => $body,
                'headers'   => [
                    'Content-Type'  => 'application/json',
                    'token'         => $token,
                ],
            ]);

            // Log the API response
            if (is_wp_error($response)) {
                error_log('Error: ' . $response->get_error_message());
            } else {
                error_log("Response Status Code: " . wp_remote_retrieve_response_code($response));
                error_log("Response Body: " . wp_remote_retrieve_body($response));
            }
        }

        // Prepare data for a new WPForms entry
        $new_entry_data = [
            'form_data' => $form_data, // Form structure
            'fields'    => [], // Fields and their updated values
        ];

        // Populate fields with the updated data from the submitted form
        foreach ($fields as $field) {
            if (isset($field['id']) && isset($field['value'])) {
                $new_entry_data['fields'][$field['id']] = $field['value'];
            }
        }

        // Create a new entry in WPForms
        $new_entry = wpforms()->entry->add($new_entry_data);
        if ($new_entry) {
            error_log("Successfully created new entry with ID: " . $new_entry);
        } else {
            error_log("Failed to create new entry.");
        }

        // Continue with your usual API logic...
        $token = isset($_COOKIE['token']) ? $_COOKIE['token'] : 'token not found';
        error_log("Extracted token: " . $token);

        $json_data = json_encode(['entryId' => $entry_Id]); // Use the new entry ID
        error_log('Sending entryId: ' . $entry_Id);

        $api_url = 'https://serverapi.talopakettiin.fi/api/forms/receive-form-data';

        $response = wp_remote_post($api_url, [
            'method'    => 'POST',
            'body'      => $json_data,
            'headers'   => [
                'Content-Type'  => 'application/json',
                'token'         => $token,
            ],
        ]);

        if (is_wp_error($response)) {
            error_log('Error: ' . $response->get_error_message());
        } else {
            error_log("Response Status Code: " . wp_remote_retrieve_response_code($response));
            error_log("Response Body: " . wp_remote_retrieve_body($response));
        }
    }
    
    // Handle Form ID 942
    else if ($form_data['id'] == 942) {
        error_log("Handling form ID 942.");

        $username = '';
        $confirmationCode = '';

        foreach ($fields as $field) {
            if (isset($field['name']) && isset($field['value'])) {
                if ($field['name'] == "Username") {
                    $username = sanitize_text_field($field['value']);
                    error_log("Username is: " . $username);
                } elseif ($field['name'] == "Confirmation Code") {
                    $confirmationCode = sanitize_text_field($field['value']);
                    error_log("Confirmation Code is: " . $confirmationCode);
                }
            }
        }

        if (!empty($username) && !empty($confirmationCode)) {
            $json_data = json_encode([
                'username' => $username,
                'confirmationCode' => $confirmationCode,
            ]);

            $api_url = 'https://serverapi.talopakettiin.fi/api/user/confirm-signup';

            $response = wp_remote_post($api_url, [
                'method'    => 'POST',
                'body'      => $json_data,
                'headers'   => ['Content-Type' => 'application/json'],
            ]);

            if (is_wp_error($response)) {
                error_log('Error: ' . $response->get_error_message());
            } else {
                error_log("Response Status Code: " . wp_remote_retrieve_response_code($response));
                error_log("Response Body: " . wp_remote_retrieve_body($response));
            }
        } else {
            error_log("Username or Confirmation Code not found for Form ID 942.");
        }
    } else if ($form_data['id'] == 2164) {
		error_log("Handling form ID 2164");
		
		$oldPassword = '';
		$newPassword = '';
		
		foreach ($fields as $field) {
			 if (isset($field['name']) && isset($field['value'])) {
                if ($field['name'] == "Existing Password") {
                    $oldPassword = sanitize_text_field($field['value']);
                } elseif ($field['name'] == "New Password") {
                    $newPassword = sanitize_text_field($field['value']);
                }
            }
		}
		
		if (!empty($oldPassword) && !empty($newPassword)) {
			$json_data = json_encode([
				'oldPassword' => $oldPassword,
				'newPassword' => $newPassword
			]);
		
		$api_url = 'https://serverapi.talopakettiin.fi/api/user/change-user-password';

		$response = wp_remote_post($api_url, [
			'method'    => 'POST',
			'body'      => $json_data,
			'headers'   => [
                'Content-Type' => 'application/json',
                'token'         => $token
            ]
		]);
		
	if (is_wp_error($response)) {
           error_log('Error: ' . $response->get_error_message());
        } else {
           error_log("Response Status Code: " . wp_remote_retrieve_response_code($response));
		  error_log("Response Body: " . wp_remote_retrieve_body($response));
	    }
        } else {
            error_log("Password change was not successful.");
        }
	} 
	else if ($form_data['id'] == 2180) {
		error_log("Handling form ID 2164");
		
		$oldPassword = '';
		$newEmail = '';
		
		foreach ($fields as $field) {
			 if (isset($field['name']) && isset($field['value'])) {
                if ($field['name'] == "Existing Password") {
                    $oldPassword = sanitize_text_field($field['value']);
                } elseif ($field['name'] == "New Email") {
                    $newPassword = sanitize_text_field($field['value']);
                }
            }
		}
		
		if (!empty($oldPassword) && !empty($newPassword)) {
			$json_data = json_encode([
				'oldPassword' => $oldPassword,
				'newEmail' => $newEmail
			]);
		
		$api_url = 'https://serverapi.talopakettiin.fi/api/user/change-user-email';

        $response = wp_remote_post($api_url, [
			'method'    => 'POST',
			'body'      => $json_data,
			'headers'   => [
                'Content-Type' => 'application/json',
                'token'         => $token
            ]
		]);
		
	if (is_wp_error($response)) {
           error_log('Error: ' . $response->get_error_message());
        } else {
           error_log("Response Status Code: " . wp_remote_retrieve_response_code($response));
		  error_log("Response Body: " . wp_remote_retrieve_body($response));
	    }
        } else {
            error_log("Email change was not successful.");
        }
	} 
    
    
    // Default case: Log an unsupported form ID
    else {
        error_log("Form ID does not match any known handlers. Skipping.");
    }
}

add_action('wpforms_process_complete', 'capture_form_id_as_json', 10, 4);


// Add AJAX action handlers
add_action('wp_ajax_get_entry_data', 'fetch_entry_data');
add_action('wp_ajax_nopriv_get_entry_data', 'fetch_entry_data');


function fetch_entry_data() {
    // Check if entryId is provided in the URL
    if (!isset($_GET['entryId']) || empty($_GET['entryId'])) {
        wp_send_json_error(['message' => 'Entry ID is required.'], 400);
    }

    $entryId = sanitize_text_field($_GET['entryId']);

    // Fetch the entry data from the database
    global $wpdb;
    $table_name = $wpdb->prefix . 'wpforms_entries'; // Replace with your actual table name for entries

    // Prepare query to fetch the entry data
    $query = $wpdb->prepare(
        "SELECT * FROM $table_name WHERE entry_id = %d LIMIT 1",
        intval($entryId)
    );

    $entry = $wpdb->get_row($query, ARRAY_A);

    if (!$entry) {
        wp_send_json_error(['message' => 'No entry found for the provided Entry ID.'], 404);
    }

    // Clean the entry data
    $cleaned_entry = clean_single_entry($entry);

    // Send the cleaned entry data as a JSON response
    wp_send_json_success($cleaned_entry);
}

// Function to clean a single entry
function clean_single_entry($entry) {
    // Ensure the entry is an array and not empty
    if (!is_array($entry) || empty($entry)) {
        return [];
    }

    // Start by adding the entryId field to the cleaned data
    $cleanedEntry = ['entryId' => $entry['entry_id']]; // Add the entryId field

    // Decode the JSON-encoded 'fields' if it exists
    if (isset($entry['fields'])) {
        // Decode the 'fields' JSON string to an associative array
        $fields = json_decode($entry['fields'], true);

        // If decoding is successful and fields are present, clean the fields
        if (is_array($fields)) {
            $cleanedFields = [];
            foreach ($fields as $field) {
                // Extract 'name' and 'value' for each field
                $name = isset($field['name']) ? $field['name'] : null;
                $value = isset($field['value']) ? $field['value'] : null;

                // Skip empty values
                if ($name !== null && !empty($value)) {
                    // Add cleaned field to the result array
                    $cleanedFields[$name] = $value;
                }
            }

            // Add the cleaned fields to the cleaned entry
            $cleanedEntry['fields'] = $cleanedFields;
        }
    }

    return $cleanedEntry;
}


function get_offers() {
    global $wpdb;

    // Fetch and sanitize the token from cookies
    $token = isset($_COOKIE['token']) ? sanitize_text_field($_COOKIE['token']) : null;
    if (!$token) {
        error_log('[ERROR] Token not found or invalid in get_offers function.');
        wp_send_json_error(['message' => 'Token is required'], 400);
        return;
    }

    // API URL for fetching offers
    $api_url = 'https://serverapi.talopakettiin.fi/api/forms/get-user-offers';
    $response = wp_remote_get($api_url, [
        'method'  => 'GET',
        'headers' => [
            'Content-Type' => 'application/json',
            'token'        => $token
        ]
    ]);

    // Check if there is an error in the API request
    if (is_wp_error($response)) {
        $error_message = $response->get_error_message();
        error_log("[ERROR] Failed to fetch offers from API: $error_message");
        wp_send_json_error(['message' => 'Failed to fetch offers'], 500);
        return;
    }

    // Parse the API response
    $body = wp_remote_retrieve_body($response);
    error_log('[DEBUG] Raw API Response: ' . $body);
    $data = json_decode($body, true);

    // Validate the API response
    if (!isset($data['success']) || !$data['success'] || !isset($data['data']['offers']) || !is_array($data['data']['offers'])) {
        error_log('[ERROR] Invalid API response: ' . $body);
        wp_send_json_error(['message' => 'Invalid API response'], 500);
        return;
    }

    // Extract offers
    $offers = $data['data']['offers'];

    // Create a mapping of `offerId` to the full offer details (including `status`)
    $offer_map = [];
    foreach ($offers as $offer) {
        $offer_map[$offer['offerId']] = $offer; // Store the entire offer data
    }

    if (empty($offer_map)) {
        error_log('[INFO] No offer IDs returned by the API.');
        wp_send_json_success(['offers' => []]);
        return;
    }

    $offerIds = array_keys($offer_map); // Use `offerId` for the database query
    $placeholders = implode(',', array_fill(0, count($offerIds), '%d'));

    // Query the database for offers based on `entry_id` (which corresponds to `offerId`)
    $table_name = $wpdb->prefix . 'wpforms_entries';
    $query = $wpdb->prepare("
        SELECT * 
        FROM $table_name 
        WHERE entry_id IN ($placeholders)
    ", $offerIds);

    $offers_data = $wpdb->get_results($query, ARRAY_A);

    // Check the query results
    if (!empty($offers_data)) {
        error_log('[INFO] Successfully retrieved offers data from the database.');

        // Attach `id`, `offerId`, `status`, and the PDF URL to the cleaned entries
        $cleaned_offers = array_map(function ($entry) use ($offer_map) {
            $offer_id = $entry['entry_id'] ?? $entry['entryId']; // Support both naming conventions
            $api_offer = $offer_map[$offer_id] ?? []; // Get offer data from API
            
            // Add API status and ID
            $entry['id'] = $api_offer['id'] ?? null;
			$entry['entryId'] = $api_offer['entryId'] ?? null;
            $entry['status'] = $api_offer['status'] ?? 'Pending'; // Default to 'Pending' if status is missing

            // Parse the fields column to extract the PDF URL
            $fields = maybe_unserialize($entry['fields']);
            $entry['pdf_url'] = isset($fields['pdf_field_key']) ? esc_url($fields['pdf_field_key']) : null; // Replace 'pdf_field_key' with your actual WPForms field key

            return $entry;
        }, clean_entries($offers_data));

        error_log('[DEBUG] Cleaned Offers with Status: ' . print_r($cleaned_offers, true));
        wp_send_json_success(['offers' => $cleaned_offers]);
    } else {
        error_log('[INFO] No matching offers found in the database.');
        wp_send_json_success(['offers' => []]);
    }
}

// Add WordPress AJAX hooks
add_action('wp_ajax_get_offers', 'get_offers');
add_action('wp_ajax_nopriv_get_offers', 'get_offers');



function clean_entries($entries) {
    // Ensure the entries is an array and not empty
    if (!is_array($entries) || empty($entries)) {
        return [];
    }

    // Process each entry
    $cleaned = array_map(function($entry) {
        // Start by adding the entryId field to the cleaned data
        $cleanedEntry = ['entryId' => $entry['entry_id']]; // Add the entryId field
        
        // Decode the JSON-encoded 'fields' if it exists
        if (isset($entry['fields'])) {
            // Decode the 'fields' JSON string to an associative array
            $fields = json_decode($entry['fields'], true);
            
            // If decoding is successful and fields are present, clean the fields
            if (is_array($fields)) {
                $cleanedFields = [];
                foreach ($fields as $field) {
                    // Extract 'name' and 'value' for each field
                    $name = isset($field['name']) ? $field['name'] : null;
                    $value = isset($field['value']) ? $field['value'] : null;

                    // If the 'value' is empty, skip this field or set to null
                    if ($name !== null && !empty($value)) {
                        // Add cleaned field to the result array
                        $cleanedFields[$name] = $value;
                    }
                }

                // Add the cleaned fields to the cleaned entry
                $cleanedEntry['fields'] = $cleanedFields;
            }
        }

        // Return the cleaned entry with entryId and cleaned fields
        return $cleanedEntry;
    }, $entries);

    // Filter out any null values in case 'fields' was missing or empty
    return array_filter($cleaned);
}

add_action('wp_ajax_get_applications', 'handle_get_applications');
add_action('wp_ajax_nopriv_get_applications', 'handle_get_applications');

function handle_get_applications() {
    $applications = get_applications(); // Call the PHP function you defined earlier

    if ($applications) {
        wp_send_json_success($applications); // Send successful response
    } else {
        wp_send_json_error(['message' => 'No applications found or an error occurred']);
    }
}

function get_applications() {
    global $wpdb;

    // Fetch and sanitize the token and user type from cookies
    $token = isset($_COOKIE['token']) ? sanitize_text_field($_COOKIE['token']) : null;
    $userType = isset($_COOKIE['usertype']) ? sanitize_text_field($_COOKIE['usertype']) : null;

    if (!$token) {
        return false; // token is required
    }

    // Determine the API endpoint based on user type
    $api_url = ($userType === 'provider')
        ? 'https://serverapi.talopakettiin.fi/api/forms/get-all-entries'
        : 'https://serverapi.talopakettiin.fi/api/forms/get-user-forms';

    // Send GET request with Authorization header (token)
    $response = wp_remote_get($api_url, [
        'method'  => 'GET',
        'headers' => [
            'Content-Type' => 'application/json',
            'token'        => $token, // Pass the token in the Authorization header
            'usertype'     => $userType,
        ]
    ]);

    // Check for errors in the request
    if (is_wp_error($response)) {
        return false;
    }

    // Retrieve the response body
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
	error_log("THis is the data" . print_r($data, true));

    // Validate the response format
    if (is_null($data) || !is_array($data)) {
        return false;
    }

    $entry_ids = [];

    // Handle provider response
    if ($userType === 'provider' && isset($data['entries'])) {
        foreach ($data['entries'] as $entry) {
            // Check if entryId exists and is a string, then convert to an integer
            if (isset($entry['entryId'])) {
                $entry_ids[] = intval($entry['entryId']); // Convert to integer
            }
        }
    } 
    // Handle customer response (applications contains a list of entryIds)
    else if ($userType === 'customer' && isset($data['applications'])) {
        foreach ($data['applications'] as $application) {
            // If the data is just a list of entryIds, directly convert each one to integer
            if (is_string($application)) {
                $entry_ids[] = intval($application); // Convert to integer
            }
        }
    }

    // Prevent empty entry IDs from breaking the query
    if (empty($entry_ids)) {
        return false;
    }

    // Prepare the list of entry IDs for SQL query
    $placeholders = implode(',', array_fill(0, count($entry_ids), '%d')); // Prepare placeholders like %d,%d,%d
    $query = "
        SELECT * 
        FROM {$wpdb->prefix}wpforms_entries 
        WHERE entry_id IN ($placeholders)
    ";

    // Execute the query and fetch the entries
    $query = $wpdb->prepare($query, ...$entry_ids); // Use prepare to safely insert entry IDs
    $entries = $wpdb->get_results($query, ARRAY_A); // Fetch results as an associative array

    // Log the entries or indicate if none found
    if (!empty($entries)) {
        return clean_entries($entries); // Return the cleaned entries
    } else {
        return false;
    }
}

function enqueue_prefill_script() {
    if (is_page('form-page')) {
        wp_enqueue_script(
            'prefill-form',
            '', // No external file if inline script is used
            ['jquery'],
            null,
            true
        );

        wp_localize_script(
            'jquery', // Attach localization to an already-enqueued script
            'ajax_object',
            [
                'ajax_url' => admin_url('admin-ajax.php'),
            ]
        );
    }
}
add_action('wp_enqueue_scripts', 'enqueue_prefill_script');



function get_application_data() {
    global $wpdb;

    // Log for debugging
    error_log('AJAX request received in handle_get_application_data');

    // Get entryId from the request and validate
    $entryId = isset($_GET['entryId']) ? intval($_GET['entryId']) : null;
    if (!$entryId) {
        error_log('Invalid entry ID provided');
        wp_send_json_error(['message' => 'Invalid entry ID']);
    }

    // Query the database to fetch the entry from wpforms_entries
    $query = $wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}wpforms_entries WHERE entry_id = %d",
        $entryId
    );

    $entry = $wpdb->get_row($query, ARRAY_A);

    if (!$entry) {
        error_log('No entry found for entry ID: ' . $entryId);
        wp_send_json_error(['message' => 'Entry not found']);
    }

    // Decode the JSON-encoded 'fields' column (where form data is stored)
    $entry['fields'] = json_decode($entry['fields'], true);

    // Log the entry data for debugging
    error_log('Entry data found: ' . print_r($entry, true));

    // Send the entry data back as a JSON response
    wp_send_json_success($entry);
}
add_action('wp_ajax_get_application_data', 'get_application_data');
add_action('wp_ajax_nopriv_get_application_data', 'get_application_data');


function wpf_prefill_form_script() {
    if (is_page('form-page')) { // Replace 'form-page' with your page slug or ID
        ?>
        <script>
            jQuery(function($) {
                var formID = 613; // Replace with your form ID
                var entryId = new URLSearchParams(window.location.search).get('entryId'); // Get entryId from URL

                console.log("Entry ID from URL:", entryId);

                if (entryId) {
                    // Fetch application data
                    $.ajax({
                        url: "<?php echo admin_url('admin-ajax.php'); ?>",
                        method: 'GET',
                        data: {
                            action: 'get_application_data',
                            entryId: entryId
                        },
                        success: function(response) {
                            console.log("AJAX response:", response);
                            if (response.success) {
                                const fields = Object.values(response.data.fields);
                                prefillForm(fields);
                            } else {
                                console.error('Error fetching data:', response.data.message);
                            }
                        },
                        error: function(error) {
                            console.error('AJAX error:', error);
                        }
                    });
                } else {
                    console.warn("Entry ID not found in the URL.");
                }

                // Prefill form fields function
                function prefillForm(fields) {
                    fields.forEach(field => {
                        var fieldSelector = `#wpforms-${formID}-field_${field.id}`;

                        // Skip empty values
                        if (!field.value) return;

                        var $field = $(fieldSelector);

                        if ($field.length === 0) {
                            console.warn(`Field not found: ${field.id}`);
                            return;
                        }

                        // Prefill the specific number fields using the IDs or classes you provided

                        // Budjetti Min
                        if ($('.wpf-num-min-limit-budjetti-sort input').length > 0) {
                            $('.wpf-num-min-limit-budjetti-sort input').val(field.value);
                        }

                        // Budjetti Max
                        if ($('.wpf-num-max-limit-budjetti-sort input').length > 0) {
                            $('.wpf-num-max-limit-budjetti-sort input').val(field.value);
                        }

                        // Talo Min Size
                        if ($('.wpf-num-min-limit-talo-sort input').length > 0) {
                            $('.wpf-num-min-limit-talo-sort input').val(field.value);
                        }

                        // Talo Max Size
                        if ($('.wpf-num-max-limit-talo-sort input').length > 0) {
                            $('.wpf-num-max-limit-talo-sort input').val(field.value);
                        }

                        // Additional fields can follow the same pattern...

                        // For general input fields (like text or number fields that don't need specific classes)
                        if ($field.is('input[type="text"], textarea, input[type="number"]')) {
                            $field.val(field.value);

                        // Select dropdowns
                        } else if ($field.is('select')) {
                            $field.val(field.value).change();

                        // Radio buttons (single selection)
                        } else if ($(`#wpforms-${formID}-field_${field.id}-container`).hasClass('wpforms-field-radio')) {
                            var $radioContainer = $(`#wpforms-${formID}-field_${field.id}-container`);
                            var $fieldset = $radioContainer.find('fieldset');

                            if ($fieldset) {
                                var $ul = $fieldset.find('ul');
                                if ($ul.length > 0) {
                                    $ul.find('li').each(function() {
                                        var $li = $(this);
                                        var $input = $li.find('input[type="radio"]');
                                        if ($input.length > 0 && $input.val() == field.value) {
                                            $li.addClass('wpforms-selected');
                                            $input.attr('checked', 'checked');
                                            $input.addClass('wpforms-valid');
                                        }
                                    });
                                }
                            }

                        // Checkboxes (multiple selections)
                        } else if ($(`#wpforms-${formID}-field_${field.id}-container`).hasClass('wpforms-field-checkbox')) {
                            var $checkboxContainer = $(`#wpforms-${formID}-field_${field.id}-container`);
                            var $fieldset = $checkboxContainer.find('fieldset');

                            if ($fieldset) {
                                var $ul = $fieldset.find('ul');
                                if ($ul.length > 0) {
                                    console.log("Found the field values: ", field.value);
                                    
                                    // Split the value_raw by newlines to get individual options
                                    var prefilledValues = field.value_raw.split('\n');
                                    console.log("Prefilled values split by newlines: ", prefilledValues);

                                    // Loop through each prefilled value
                                    prefilledValues.forEach(value => {
                                        // If the value exists in the list of checkboxes
                                        $ul.find('li').each(function() {
                                            var $li = $(this);
                                            var $input = $li.find('input[type="checkbox"]');
                                            
                                            if ($input.length > 0 && $input.val() == value) {
                                                // If the checkbox input value matches, add 'wpforms-selected' to the <li> and set aria-invalid to false
                                                $li.addClass('wpforms-selected');
                                                $input.attr('checked', 'checked'); // Ensure the checkbox is checked
                                                $input.addClass('wpforms-valid');
                                            }
                                        });
                                    });
                                }
                            }
                        }
                    });
                }
            });
        </script>
        <?php
    }
}
add_action('wp_footer', 'wpf_prefill_form_script');


function accept_given_offer() {
    // Read and parse the raw input data
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        error_log('Invalid JSON received in accept_given_offer');
        wp_send_json_error('Invalid JSON received.');
        return;
    }

    // Validate the offer data
    error_log("This is the data: " . print_r($data, true));
    if (!isset($data['Offer'])) {
        error_log('No offer data provided in accept_given_offer');
        wp_send_json_error('No offer data provided.');
        return;
    }

    $offer = $data['Offer'];

    // Sanitize input data
    function recursive_sanitize_text_field($data) {
        if (is_array($data)) {
            return array_map('recursive_sanitize_text_field', $data);
        }
        return sanitize_text_field($data);
    }
    $sanitized_offer = recursive_sanitize_text_field($offer);

    // Log sanitized data
    error_log('This is the sanitized offer: ' . print_r($sanitized_offer, true));

    // Retrieve the token
    $token = isset($_COOKIE['token']) ? sanitize_text_field($_COOKIE['token']) : null;
    if (!$token) {
        error_log('token not found or invalid in accept_given_offer');
        wp_send_json_error('token not found or invalid.');
        return;
    }

    // Prepare API request
    $api_url = 'https://serverapi.talopakettiin.fi/api/forms/accept-given-offer';
    $headers = array(
        'Content-Type' => 'application/json',
        'token'        => $token,
    );

    $data = json_encode($sanitized_offer);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('JSON encoding error in accept_given_offer: ' . json_last_error_msg());
        wp_send_json_error('Failed to encode data as JSON.');
        return;
    }

    $response = wp_remote_post($api_url, array(
        'method'  => 'PUT',
        'headers' => $headers,
        'body'    => $data,
    ));

    // Handle API response
    if (is_wp_error($response)) {
        error_log('Error in wp_remote_post in accept_given_offer: ' . $response->get_error_message());
        wp_send_json_error('Failed to accept the offer.', $response->get_error_message());
    } else {
        $body = wp_remote_retrieve_body($response);
        $decoded_body = json_decode($body, true);

        if (is_array($decoded_body) && !empty($decoded_body['success']) && $decoded_body['success'] === true) {
            wp_send_json_success('Offer accepted successfully.');
        } else {
            error_log('API response error in accept_given_offer: ' . print_r($decoded_body, true));
            wp_send_json_error('Failed to accept the offer.', isset($decoded_body['error']) ? $decoded_body['error'] : 'Unknown error');
        }
    }
}
add_action('wp_ajax_accept_given_offer', 'accept_given_offer');
add_action('wp_ajax_nopriv_accept_given_offer', 'accept_given_offer');


function log_out() {
    error_log("Trying to log out");
    $token = isset($_COOKIE['token']) ? sanitize_text_field($_COOKIE['token']) : null;

    if (!$token) {
        error_log('token not found or invalid in log_out');
        wp_send_json_error(['message' => 'token not found or invalid.']);
        return;
    }

    // External API URL
    $api_url = 'https://serverapi.talopakettiin.fi/api/user/logout';

    // API headers
    $headers = array(
        'Content-Type' => 'application/json',
        'token'        => $token,
    );

    // Send POST request to the API
    $response = wp_remote_post($api_url, array(
        'method'    => 'POST',
        'headers'   => $headers,
        'timeout'   => 3, // Add timeout to avoid hanging indefinitely
    ));

    // Check for HTTP errors or connection issues
    if (is_wp_error($response)) {
        error_log('Error connecting to logout API: ' . $response->get_error_message());
        wp_send_json_error(['message' => 'Failed to log out due to server error.']);
        return;
    }

    // Check the API response code and handle accordingly
    $response_code = wp_remote_retrieve_response_code($response);
    $response_body = wp_remote_retrieve_body($response);

    if ($response_code === 200) {
        // Clear the cookies locally
        setcookie('token', '', time() - 3600, '/', 'talopakettiin.fi', true, true);
        setcookie('usertype', '', time() - 3600, '/', 'talopakettiin.fi', true, true);

        wp_send_json_success(['message' => 'Successfully logged out.']);
    } else {
        error_log('Logout API returned error: ' . $response_code . ' - ' . $response_body);
        wp_send_json_error(['message' => 'Logout failed. Please try again.']);
    }
}

add_action('wp_ajax_log_out', 'log_out');
add_action('wp_ajax_nopriv_log_out', 'log_out'); // For non-logged-in users if needed

function validate_user_token() {
    $token = isset($_COOKIE['token']) ? sanitize_text_field($_COOKIE['token']) : null;

    if (!$token) {
        wp_send_json_error(['message' => 'No token found']);
        return;
    }

    $api_url = 'https://serverapi.talopakettiin.fi/api/user/validate-token';

    $args = [
        'method'    => 'POST',
        'headers'   => [
            'Content-Type'  => 'application/json',
            'token'         => $token,  // Sending token in headers
        ],
        'timeout'   => 10
    ];

    $response = wp_remote_post($api_url, $args);

    // Check for errors
    if (is_wp_error($response)) {
        wp_send_json_error(['message' => 'Error connecting to API', 'error' => $response->get_error_message()]);
        return;
    }

    // Get the response body
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    // Check if the API validated the token
    if (isset($data['success']) && $data['success'] === true) {
        wp_send_json_success(['message' => 'User is authenticated']);
    } else {
        wp_send_json_error(['message' => $data['message'] ?? 'Invalid or expired token']);
    }
}

// Add AJAX actions
add_action('wp_ajax_validate_user_token', 'validate_user_token');
add_action('wp_ajax_nopriv_validate_user_token', 'validate_user_token');



