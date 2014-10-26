<?php
function kv_init_scripts() {
    wp_deregister_script( 'jquery' );  // de-registered the exisitng jquery file and include my own one. 
 
    wp_enqueue_script('jquery', get_template_directory_uri()  . '/js/jquery.min.js', '', '', true);
 
    //likewise include all the necessary supportive js files. 
}    
 add_action('init', 'kv_init_scripts', 0);
if (!is_admin())  {
    add_action('init', 'kv_init_scripts', 0);
}
?>