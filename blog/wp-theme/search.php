<?php
    get_header(); ?>
            <div  class="row" role="main">
 
            <?php if ( have_posts() ) : ?>
 
                <header class="page-header">
                    <h1 class="page-title"><?php printf( __( 'Search Results for: %s', 'shape' ), '<span>' . get_search_query() . '</span>' ); ?></h1>
                </header><!-- .page-header -->
 
                <?php shape_content_nav( 'nav-above' ); ?>
 
                <?php while ( have_posts() ) : the_post(); ?>
 
                    <?php get_template_part( 'content', 'search' ); ?>
 
                <?php endwhile; ?>
 
                <?php shape_content_nav( 'nav-below' ); ?>
 
            <?php else : ?>
 
                <?php get_template_part( 'no-results', 'search' ); ?>
 
            <?php endif; ?>
 
            </div>     
 
<?php get_sidebar(); ?>
<?php get_footer(); ?>
