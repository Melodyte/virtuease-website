#!/usr/bin/env python3
"""Script to update footer across all HTML files to match the live WordPress site."""

import os
import re

FILES = [
    "index.html",
    "about.html",
    "faq.html",
    "portfolio.html",
    "contact.html",
    "blog.html",
    "website-development.html",
    "seo-google-business-profile-optimization.html",
    "article-and-blog-writing.html",
    "virtual-assistant.html",
]

BASE_DIR = "/Users/melodyte/Documents/VirtuEase"

# The old footer content (from <footer> to </footer>)
OLD_FOOTER = """  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h3>VirtuEase</h3>
          <p>Your Creative Growth Partner.</p>
          <div class="social-links">
            <a href="#" target="_blank" rel="noopener">Fb. /</a>
            <a href="#" target="_blank" rel="noopener">Ig. /</a>
            <a href="#" target="_blank" rel="noopener">Tw. /</a>
            <a href="#" target="_blank" rel="noopener">Be.</a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul class="quick-links">
            <li><a href="/">Home</a></li>
            <li><a href="/faq">Faq</a></li>
            <li><a href="/contact-us">Contact</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
        <div>
          <h4>Work inquiries</h4>
          <p>Interested in working with us?</p>
          <a href="mailto:admin@virtueasepro.com">admin@virtueasepro.com</a>
        </div>
        <div>
          <h4>Sign up for the newsletter</h4>
          <form class="newsletter-form">
            <input type="email" placeholder="Your email address" required>
            <button type="submit">Subscribe</button>
          </form>
          <p style="margin-top:12px;font-size:12px;opacity:.5">I'm okay with getting emails and having that activity tracked to improve my experience.</p>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2025 VirtuEase. All rights reserved.
      </div>
    </div>
  </footer>"""

NEW_FOOTER = """  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a href="/" class="footer-logo"><img src="assets/images/logo.png" alt="VirtuEase"></a>
          <div class="social-links">
            <a href="#"><strong>Fb.</strong></a>&nbsp;/&nbsp;&nbsp;
            <a href="#"><strong>Ig.</strong></a>&nbsp;/&nbsp;&nbsp;
            <a href="#"><strong>Tw.</strong></a>&nbsp;/&nbsp;&nbsp;
            <a href="#"><strong>Be.</strong></a>
          </div>
        </div>
        <div>
          <h3>VirtuEase</h3>
          <p><strong>Your Creative Growth Partner.</strong></p>
          <h2 class="footer-heading">Quick Links</h2>
          <ul class="quick-links">
            <li><a href="/">Home</a></li>
            <li><a href="/faq">Faq</a></li>
            <li><a href="/contact-us">Contact</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="#">Services</a></li>
          </ul>
        </div>
        <div>
          <h3>Work inquiries</h3>
          <p>Interested in working with us?</p>
          <a href="mailto:info@virtueasepro.com"><strong>info@virtueasepro.com</strong></a>
        </div>
        <div>
          <h3>Sign up for the newsletter</h3>
          <form class="newsletter-form">
            <input type="email" name="your-email" placeholder="Your email address" required>
            <button type="submit">Sign Up</button>
          </form>
          <label class="newsletter-checkbox"><input type="checkbox" name="checkbox-101[]" required><span>I'm okay with getting emails and having that activity tracked to improve my experience.</span></label>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2025 <a href="https://virtueasepro.com" target="_blank">VirtuEase</a>. All rights reserved.
      </div>
    </div>
  </footer>"""

updated = []
skipped = []

for fname in FILES:
    fpath = os.path.join(BASE_DIR, fname)
    if not os.path.exists(fpath):
        skipped.append(fname)
        continue
    
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if OLD_FOOTER in content:
        new_content = content.replace(OLD_FOOTER, NEW_FOOTER)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        updated.append(fname)
    else:
        skipped.append(fname)
        print(f"WARNING: Old footer not found in {fname}")

print(f"\nUpdated {len(updated)} files: {', '.join(updated)}")
if skipped:
    print(f"Skipped {len(skipped)} files: {', '.join(skipped)}")
