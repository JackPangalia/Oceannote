// src/extensions/InsertText.js
import { Extension } from '@tiptap/core';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-proj-4HVtoSGuZGinbWllNYvrT3BlbkFJeEIW2dThb9r2cpvGwrVS',
  dangerouslyAllowBrowser: true,
});


export const InsertText = Extension.create({
  name: 'insertText',

  addCommands() {
    return {
      insertText: (text) => async ({ chain }) => {
        try {
          console.log('Generating completion...');
          const response = await openai.chat.completions.create({
            messages: [
              { role: "system", content: "You are a helpful assistant for text completion." },
              { role: "user", content: text }
            ],
            model: "gpt-3.5-turbo-0125"
          });

          const aiCompletion = response.choices[0].message.content;
          console.log('Completion generated:', aiCompletion);

          return chain().insertContent(aiCompletion).run()
        } catch (error) {
          console.error('Error generating completion:', error);
          return false;
        }
      },
    };
  },
});