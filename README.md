<img width="3012" height="1552" alt="image" src="https://github.com/user-attachments/assets/ab5b24ca-8c44-414e-a641-d5cb1b574db6" />

<img width="3012" height="1552" alt="image" src="https://github.com/user-attachments/assets/b2280f58-a015-40b5-8695-6723527324e9" />


# Veo Motion

Veo Motion is a React application that transforms still photos into seamless looping videos using Google's Veo generative video model (`veo-3.1-fast-generate-preview`).

![Veo Motion Preview](https://gstatic.com/ai_studio_images/veo_motion_preview.png)

## Features

*   **Image-to-Video Generation**: Upload a photo to use as the starting frame for your video.
*   **Text Control**: Enhance the generation with optional text prompts (e.g., "gentle breeze", "cinematic pan") to guide the motion.
*   **Aspect Ratios**: Support for both Landscape (16:9) and Portrait (9:16) formats.
*   **Seamless Loops**: Automatically prompts the model to create smooth, looping videos suitable for backgrounds or social media.
*   **Modern UI**: A responsive, dark-mode interface built with Tailwind CSS.

## Technologies Used

*   **Frontend**: React 19, TypeScript
*   **AI Model**: Google Gemini API (Veo 3.1) via `@google/genai` SDK
*   **Styling**: Tailwind CSS
*   **Environment**: Optimized for Project IDX / Google AI Studio

## Prerequisites

To generate videos with Veo, you must have:
1.  A Google Cloud Project with billing enabled.
2.  Access to the Veo models enabled in your project.

## Usage

1.  **Select API Key**: Upon launching the app, you will be prompted to select a paid API key via the secure environment dialog.
2.  **Upload Image**: Drag and drop an image or click to select one from your device.
3.  **Configure**:
    *   (Optional) Add a descriptive prompt to influence the animation style.
    *   Choose your desired aspect ratio (Landscape or Portrait).
4.  **Generate**: Click "Generate Video" and wait for the AI to process your request.
5.  **Download**: Once complete, preview the video in the player and download the `.mp4` file.

## License

MIT
