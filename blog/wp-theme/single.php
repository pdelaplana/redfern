<div class="row" > 
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
        <div class="panel">
            <div class="panel-header"><?php the_title(); ?></div>
 
            <div class="panel-content">
                <?php the_content( ); ?>
            </div>
            <div class="notice">
                <?php the_category(', '); the_tags( ' Tags: ', ', ', '</p>'); ?>
            </div>
        </div> 
         <?php endwhile;
    else : ?>
        <div class="panel-header">Not Found</div>
            <p class="center">Sorry, but you are looking for something that isn't here.</p>
            <?php include (TEMPLATEPATH . "/search.php"); ?>
    <?php endif; ?>
</div>