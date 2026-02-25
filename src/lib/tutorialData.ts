import { TutorialStep } from '../components/ui/TutorialOverlay';

export const TUTORIALS: Record<string, TutorialStep[]> = {
  create: [
    {
      title: "Choose Your Format",
      description: "Start by selecting what you want to make. From TikTok scripts to AI images, we have a tool for every platform.",
      actionLabel: "Try TikTok Format",
      onAction: () => console.log("Demo: Selected TikTok"), // In real app, could set state
    },
    {
      title: "Input Your Idea",
      description: "Just type a simple topic like 'Healthy Breakfast'. Our AI will handle the creative heavy lifting.",
    },
    {
      title: "Select a Style",
      description: "Customize the tone and vibe. Want it 'Bold & Loud' or 'Minimalist'? You decide.",
    },
    {
      title: "Generate Magic",
      description: "Click generate and watch as we create scripts, visuals, and more in seconds.",
    }
  ],
  edit: [
    {
      title: "Upload Your Media",
      description: "Drag and drop your video or image to get started. Or try one of our demo projects.",
      actionLabel: "Load Demo Project",
    },
    {
      title: "Magic Tools",
      description: "Use the toolbar on the left to add Auto Captions, AI Voiceovers, or even an AI Avatar presenter.",
    },
    {
      title: "Timeline Editor",
      description: "Trim, cut, and arrange your clips in the timeline below. It's simple but powerful.",
    }
  ],
  assist: [
    {
      title: "Your Creative Partner",
      description: "Stuck on ideas? Ask the Assistant. It knows your niche and brand voice.",
    },
    {
      title: "Quick Actions",
      description: "Use the chips above the chat to instantly generate hooks, captions, or find trends.",
      actionLabel: "Try 'Viral Hooks'",
    },
    {
      title: "Save & Copy",
      description: "Hover over any message to copy the text or save it to your project notes.",
    }
  ],
  publish: [
    {
      title: "Multi-Platform Export",
      description: "One video, everywhere. Select a platform to automatically resize your content.",
    },
    {
      title: "Smart Preview",
      description: "See exactly how your video will look on TikTok, Reels, or Shorts before you export.",
    },
    {
      title: "Thumbnail Gen",
      description: "Don't forget the thumbnail! Use our AI generator to create a click-worthy cover.",
    }
  ],
  monetize: [
    {
      title: "Setup Your Profile",
      description: "Tell us about your niche and audience to generate a professional Media Kit.",
    },
    {
      title: "Link Hub",
      description: "Manage all your affiliate links and products in one place. Track clicks and revenue.",
    },
    {
      title: "Get Paid",
      description: "Connect your payment details to start accepting sponsorships and selling products.",
    }
  ]
};
