export const STORY_PROMPTS = {
  '2CS': `Create a rhyming counting story for children 0-2. Alternatively count to 3 or 5 using "one, two, buckle my shoe" or "one, two, three, listen to me". Feature familiar objects for young children, such as toys, foods, or clothing items. Every new rhyming line should end with a line break HTML tag <br/>`,

  '2NR': `Create a nursery rhyme for ages 0-2 featuring a simple concept, like a familiar object or activity. Rhyme should count up to 3, 5, or 10. Every new rhyming line should end with a line break HTML tag <br/>`,

  '2BS': `Create a soothing bedtime story for children 0-2, featuring a {main_character}. {main_character_text}. The theme is {story_theme}.`,

  '5NR': `Create an engaging nursery rhyme for preschoolers aged 3-5, focusing on a simple theme like an animal or a favorite food. The rhyme should have verses counting up to 5 or 10. Please ensure the language is playful and suitable for young listeners. Every new rhyming line should end with a line break HTML tag <br/>`,

  '5FT': `Create a beautiful fairy tale for a child aged 3-5 featuring a {main_character}. {main_character_text}. The theme is {story_theme}.`,

  '5BS': `Create a soothing bedtime story for children 3-5 featuring a {main_character}. {main_character_text}. The theme is {story_theme}.`,

  '8P': `Create a delightful poem for a child aged 6-8 featuring a {main_character}. {main_character_text}. The theme is {story_theme}.`,

  '8FT': `Create a captivating fairy tale for a child aged 6-8 featuring a {main_character}. {main_character_text}. The theme is {story_theme}.`,

  '8BS': `Create a soothing bedtime story for children 6-8 featuring a {main_character}. {main_character_text}. The theme is {story_theme}.`,
};

export const ILLUSTRATION_STYLES = {
  'Hand-drawn':
    'sketch, pencil, shading, lines, textures, doodle, simple, rough. no clean lines, no digital, no computer-generated, no precise, no detailed, no polished',
  'Pop Art':
    'bold colors, vibrant, high contrast, repetition, iconic imagery, collage. no subtle, no muted colors, no soft lines, no delicate details, no watercolor, no vintage, no comic book style',
  'Comic Book':
    'panels, action, bold, dynamic, bright, primary colors. no panels, no watercolor, no soft, no pastel colors, no delicate, no fine details, no realistic, no speech bubble, no onomatopoeia',
  Ink: 'bold lines, high contrast, black and white, pen, ink wash, stippling, texture, vintage. no soft, no pastel colors, no gradients, no watercolor, no digital',
  Linocut:
    'textured, block print, bold lines, high contrast, simple shapes, vintage, rustic. no delicate lines, no soft colors, no watercolor, no digital',
  Watercolor:
    'pastel colors, wash, transparency, fluidity, softness, blend, light, dreamy. no bold lines, no harsh edges, no precise details, no solid colors, no digital',
};
