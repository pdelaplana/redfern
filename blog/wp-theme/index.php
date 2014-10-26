<?php get_header(); ?>
 
<section id="main-content">
 
    <?php if (is_search()) :         
         get_template_part('search');         
     elseif ((is_single())  :  
            get_template_part('single');
     else :
         get_template_part('loop'); 
    endif; ?>
 
</section>
<?php 
get_sidebar(); 
get_footer(); 
?>