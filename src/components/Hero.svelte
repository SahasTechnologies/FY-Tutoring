<script>
  import { ArrowRight, Play } from 'lucide-svelte';
  import Underline from './Underline.svelte';
</script>

<div class="hero-container">
  <section class="hero" id="hero">
    <div class="hero-grid-bg"></div>
    <div class="hero-glow"></div>
    
    <div class="hero-wrap">
      <div class="hero-left">
        <h1 class="hero-h1">
          Learn in the AM,<br />
          <Underline>excel in the PM</Underline>
        </h1>
        <p class="hero-sub">
          Expert tutoring for OC and Selective by high school students across Sydney.
        </p>
        <div class="hero-btns">
          <button type="button" class="btn-primary">
            Book a trial lesson 
            <ArrowRight size={18} />
          </button>
          <button type="button" class="btn-ghost-white">
            <Play size={18} />
            Explore programs
          </button>
        </div>
      </div>
    </div>
  </section>
</div>