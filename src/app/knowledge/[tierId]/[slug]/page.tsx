import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CURRICULUM_TOPICS } from '@/data/curriculum';
import { LessonContent } from './LessonContent';

interface LessonPageProps {
  params: Promise<{
    tierId: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return CURRICULUM_TOPICS.map((topic) => ({
    tierId: topic.tierId,
    slug: topic.slug,
  }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const topic = CURRICULUM_TOPICS.find(
    (t) => t.tierId === resolvedParams.tierId && t.slug === resolvedParams.slug
  );

  if (!topic) {
    return {
      title: 'Technical Lesson | NetSecForge',
    };
  }

  return {
    title: `${topic.title} | NetSecForge Architecture`,
    description: topic.summary,
  };
}

export default async function TechnicalLessonPage({ params }: LessonPageProps) {
  const resolvedParams = await params;

  const topicIndex = CURRICULUM_TOPICS.findIndex(
    (t) => t.tierId === resolvedParams.tierId && t.slug === resolvedParams.slug
  );

  if (topicIndex === -1) {
    notFound();
  }

  const topic = CURRICULUM_TOPICS[topicIndex];
  const prevTopic = topicIndex > 0 ? CURRICULUM_TOPICS[topicIndex - 1] : null;
  const nextTopic =
    topicIndex < CURRICULUM_TOPICS.length - 1 ? CURRICULUM_TOPICS[topicIndex + 1] : null;

  return <LessonContent topic={topic} prevTopic={prevTopic} nextTopic={nextTopic} />;
}
