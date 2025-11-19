"use client";

import { useState } from 'react';
import {
  Mail, Send, Instagram, Twitter, Linkedin, Youtube,
  MessageSquare, CheckCircle2, AlertCircle, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*************** Handlers ***************/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulated submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setFormStatus("success");
    setIsSubmitting(false);

    setFormData({ name: "", email: "", subject: "", message: "" });

    setTimeout(() => setFormStatus("idle"), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /*************** FAQ + Social Data ***************/
  const faqs = [
    {
      question: "How do I view 3D menus?",
      answer: "Simply browse restaurants and click on any dish to see it in interactive 3D.",
    },
    {
      question: "Can I use this on mobile?",
      answer: "Yes! Our app is fully responsive and works great on all devices.",
    },
    {
      question: "How do restaurant owners add 3D models?",
      answer: "Restaurant owners can upload images which are automatically converted to 3D models.",
    },
    {
      question: "Is there a subscription fee?",
      answer: "Browsing is free for customers. Restaurant owners have different pricing tiers.",
    },
  ];

  const socialLinks = [
    { icon: Instagram, label: "Instagram", href: "#", color: "from-pink-500 to-purple-500" },
    { icon: Twitter, label: "Twitter", href: "#", color: "from-blue-400 to-blue-600" },
    { icon: Linkedin, label: "LinkedIn", href: "#", color: "from-blue-600 to-blue-700" },
    { icon: Youtube, label: "YouTube", href: "#", color: "from-red-500 to-red-600" },
  ];

  /*************** UI ***************/
  return (
    <div className="min-h-screen px-4 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto max-w-7xl">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 md:mb-6">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">We're Here to Help</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent px-4">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Have a question? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">

          {/* Form */}
          <div className="lg:col-span-2 order-1">
            <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 md:p-8 lg:p-10 backdrop-blur-sm">
              <h2 className="text-2xl md:text-3xl mb-2">Send us a Message</h2>
              <p className="text-gray-400 mb-6 md:mb-8">Fill out the form below and we'll get back to you shortly.</p>

              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-base md:text-lg mb-2 md:mb-3 block">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="h-11 md:h-12 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-base md:text-lg mb-2 md:mb-3 block">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="h-11 md:h-12 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50"
                  />
                </div>

                {/* Subject */}
                <div>
                  <Label htmlFor="subject" className="text-base md:text-lg mb-2 md:mb-3 block">
                    Subject
                  </Label>
                  <div className="relative">
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full h-11 md:h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white appearance-none focus:border-blue-500/50"
                    >
                      <option value="" disabled>Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="restaurant">Restaurant Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="billing">Billing Question</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-base md:text-lg mb-2 md:mb-3 block">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    className="bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 resize-none"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 md:h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                {/* Status */}
                {formStatus === "success" && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-400">Message sent successfully!</p>
                      <p className="text-sm text-green-400/70">We’ll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                {formStatus === "error" && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400">Failed to send message</p>
                      <p className="text-sm text-red-400/70">Please try again or email us directly.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:space-y-8 order-2">

            {/* Email Support */}
            <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6 md:p-8 backdrop-blur-sm">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
              </div>

              <h3 className="text-xl md:text-2xl mb-2">Email Support</h3>
              <p className="text-sm md:text-base text-gray-400 mb-4">
                Prefer email? Send us a message directly.
              </p>

              <a
                href="mailto:support@3dmenuapp.com"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors break-all text-sm md:text-base"
              >
                support@3dmenuapp.com
              </a>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  <strong className="text-white">Response Time:</strong><br />
                  Usually within 24 hours
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 md:p-8 backdrop-blur-sm">
              <h3 className="text-xl md:text-2xl mb-2">Connect With Us</h3>
              <p className="text-sm md:text-base text-gray-400 mb-6">
                Follow us on social media for updates and news.
              </p>

              <div className="space-y-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${social.color} flex items-center justify-center flex-shrink-0`}>
                      <social.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition-colors">
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 md:p-8 lg:p-10 backdrop-blur-sm">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl mb-2">Frequently Asked Questions</h2>
            <p className="text-sm md:text-base text-gray-400">Quick answers to common questions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-5 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-blue-500/30 transition-all"
              >
                <h3 className="text-lg md:text-xl mb-2 md:mb-3 text-blue-400">{faq.question}</h3>
                <p className="text-sm md:text-base text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 md:mt-8">
            <p className="text-sm md:text-base text-gray-400 mb-4">Can't find what you're looking for?</p>
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/5 hover:text-white rounded-xl h-11 md:h-12 px-6"
            >
              View Full Help Center
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
