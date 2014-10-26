<div class="row" > 
<?php if (have_posts()) : ?>
    <?php while (have_posts()) : the_post(); ?>
        <div class="panel">
    <div class="post" id="post-<!--?php the_ID(); ?-->">
        <div class="panel-header"><a href="<!--?php the_permalink() ?-->" rel="bookmark" title="Permanent Link to
        <?php the_title(); ?>"> <?php the_title(); ?></a></div>
        <small><?php the_time('F jS, Y') ?> <!-- by <!--?php the_author() ?--> --></small>
 
        <div class="panel-content">
            <?php the_content('Read the rest of this entry »'); ?>
        </div>
 
        <p class="postmetadata">Posted in <!--?php the_category(', ') ?--> <strong>|</strong>
            <?php edit_post_link('Edit','','<strong>|</strong>'); ?>
            <?php comments_popup_link('No Comments »', '1 Comment »', '% Comments
        »'); ?>
        </p>
    </div>
    </div>
    <?php endwhile; ?>
    <div class="navigation">
        <div class="alignleft"><?php next_posts_link('« Previous Entries') ?></div>
        <div class="alignright"><?php previous_posts_link('Next Entries »') ?></div>
    </div>
<?php else : ?>
    <div class="panel-header">Not Found</div>
    <p class="center">Sorry, but you are looking for something that isn't here.</p>
    <?php include (TEMPLATEPATH . "/search.php"); ?>
<?php endif; ?>
</div>