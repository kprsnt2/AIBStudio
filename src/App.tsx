import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Github, FileText, Settings, Rocket, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [copied, setCopied] = useState(false);
  
  // Profile State
  const [profile, setProfile] = useState({
    name: 'John Doe',
    profession: 'Software Engineer',
    about: 'I love building open-source tools and writing about tech.',
    twitter: 'https://twitter.com/johndoe',
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    resume: 'https://johndoe.com/resume.pdf',
    projects: '- [Project 1](https://github.com/johndoe/project1) - A cool project\n- [Project 2](https://github.com/johndoe/project2) - Another cool project',
  });

  // Playground State
  const [draft, setDraft] = useState('Just analyzed the new React 19 features. The compiler is amazing and removes the need for useMemo. Server components are now stable. Actions make form handling so much easier. I think this will change how we build web apps.');
  const [generatedBlog, setGeneratedBlog] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProfileMd = () => {
    return `---
name: ${profile.name}
profession: ${profile.profession}
twitter: ${profile.twitter}
github: ${profile.github}
linkedin: ${profile.linkedin}
resume: ${profile.resume}
---

# About Me
${profile.about}

# Projects
${profile.projects}
`;
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(generateProfileMd());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateBlog = async () => {
    if (!draft.trim()) return;
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an expert technical blog writer. Turn the following rough draft or notes into a well-structured, engaging, and professional blog post in Markdown format. Add a catchy title, introduction, body paragraphs with clear headings, and a conclusion.

Draft/Notes:
${draft}`,
      });
      setGeneratedBlog(response.text || 'Failed to generate content.');
    } catch (error) {
      console.error('Error generating blog:', error);
      setGeneratedBlog('An error occurred while generating the blog. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">AI Blog Generator</span>
          </div>
          <nav className="flex items-center gap-4">
            <a
              href="https://github.com/kprsnt2/kprsnt.in"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">Star on GitHub</span>
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mx-auto max-w-3xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 mb-6">
              Automate your personal blog with AI.
            </h1>
            <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
              Push a rough `.md` draft to your `blog_drafts` folder. GitHub Actions triggers Gemini to write a polished post, and Vercel deploys it automatically. Open-source and yours to own.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="gap-2" asChild>
                <a href="#setup">
                  <Rocket className="h-4 w-4" />
                  Get Started
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <a href="https://github.com/kprsnt2/kprsnt.in" target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                  View Repository
                </a>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Main Content Tabs */}
        <section id="setup" className="mx-auto max-w-5xl">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
              <TabsTrigger value="profile" className="text-sm sm:text-base gap-2">
                <Settings className="h-4 w-4 hidden sm:block" />
                1. Profile Setup
              </TabsTrigger>
              <TabsTrigger value="playground" className="text-sm sm:text-base gap-2">
                <Sparkles className="h-4 w-4 hidden sm:block" />
                2. AI Playground
              </TabsTrigger>
              <TabsTrigger value="deploy" className="text-sm sm:text-base gap-2">
                <Rocket className="h-4 w-4 hidden sm:block" />
                3. Deploy
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Profile Configurator */}
            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Configure Your Profile</CardTitle>
                    <CardDescription>
                      Update your details to generate your `profile.md` file. This file powers your portfolio and blog author details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="profession">Profession</Label>
                        <Input
                          id="profession"
                          value={profile.profession}
                          onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="about">About Me</Label>
                        <Textarea
                          id="about"
                          rows={4}
                          value={profile.about}
                          onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="twitter">Twitter URL</Label>
                        <Input
                          id="twitter"
                          value={profile.twitter}
                          onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="github">GitHub URL</Label>
                        <Input
                          id="github"
                          value={profile.github}
                          onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="resume">Resume Link</Label>
                        <Input
                          id="resume"
                          value={profile.resume}
                          onChange={(e) => setProfile({ ...profile, resume: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="projects">Projects (Markdown List)</Label>
                        <Textarea
                          id="projects"
                          rows={4}
                          value={profile.projects}
                          onChange={(e) => setProfile({ ...profile, projects: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Generated profile.md</Label>
                        <Button variant="ghost" size="sm" onClick={handleCopyProfile} className="h-8 gap-1">
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copied ? 'Copied' : 'Copy'}
                        </Button>
                      </div>
                      <div className="relative flex-1 rounded-md bg-zinc-950 p-4 font-mono text-sm text-zinc-50 overflow-auto min-h-[300px]">
                        <pre><code>{generateProfileMd()}</code></pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Tab 2: AI Playground */}
            <TabsContent value="playground">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Test the AI Generator</CardTitle>
                    <CardDescription>
                      Paste your rough notes or analysis below. See how Gemini transforms it into a polished blog post.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col h-full space-y-4">
                      <div className="flex-1 flex flex-col">
                        <Label htmlFor="draft" className="mb-2">Your Rough Draft (.md or .txt)</Label>
                        <Textarea
                          id="draft"
                          className="flex-1 min-h-[400px] resize-none font-mono text-sm"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder="Paste your rough notes, data analysis, or bullet points here..."
                        />
                      </div>
                      <Button 
                        onClick={handleGenerateBlog} 
                        disabled={isGenerating || !draft.trim()}
                        className="w-full gap-2"
                      >
                        {isGenerating ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-50 border-t-transparent" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        {isGenerating ? 'Generating...' : 'Generate Blog Post'}
                      </Button>
                    </div>

                    <div className="flex flex-col h-full">
                      <Label className="mb-2">Generated Output</Label>
                      <div className="flex-1 rounded-md border border-zinc-200 bg-white p-6 overflow-auto min-h-[400px] prose prose-zinc prose-sm max-w-none">
                        {generatedBlog ? (
                          <Markdown remarkPlugins={[remarkGfm]}>{generatedBlog}</Markdown>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4">
                            <FileText className="h-12 w-12 opacity-20" />
                            <p>Click generate to see the magic.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Tab 3: Deployment Guide */}
            <TabsContent value="deploy">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Deploy Your Own</CardTitle>
                    <CardDescription>
                      Follow these steps to set up your automated AI blog on Vercel.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 font-bold text-zinc-900">1</div>
                        <div>
                          <h4 className="text-lg font-semibold mb-2">Fork the Repository</h4>
                          <p className="text-zinc-600 mb-4">Start by forking the open-source template to your own GitHub account.</p>
                          <Button variant="outline" asChild>
                            <a href="https://github.com/kprsnt2/kprsnt.in/fork" target="_blank" rel="noreferrer" className="gap-2">
                              <Github className="h-4 w-4" />
                              Fork Repository
                            </a>
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 font-bold text-zinc-900">2</div>
                        <div>
                          <h4 className="text-lg font-semibold mb-2">Add Gemini API Key</h4>
                          <p className="text-zinc-600 mb-2">Get an API key from Google AI Studio and add it to your GitHub repository secrets.</p>
                          <ul className="list-disc list-inside text-sm text-zinc-600 space-y-1 mb-4">
                            <li>Go to your repository <strong>Settings {'>'} Secrets and variables {'>'} Actions</strong></li>
                            <li>Create a new repository secret named <code>GEMINI_API_KEY</code></li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 font-bold text-zinc-900">3</div>
                        <div>
                          <h4 className="text-lg font-semibold mb-2">Deploy to Vercel</h4>
                          <p className="text-zinc-600 mb-4">Import your forked repository into Vercel. The build settings will be automatically configured.</p>
                          <Button asChild>
                            <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Deploy to Vercel
                            </a>
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 font-bold text-zinc-900">4</div>
                        <div>
                          <h4 className="text-lg font-semibold mb-2">Start Writing!</h4>
                          <p className="text-zinc-600">
                            Push a new <code>.md</code> file to the <code>blog_drafts/</code> folder in your repository. The GitHub Action will automatically generate the blog post and Vercel will deploy the update!
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      
      <footer className="border-t border-zinc-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
          <p>Built with React, Tailwind CSS, and Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}
