'use client';

import React from 'react';
import GalleryEditor from '../profile-editor/GalleryEditor';

interface Props {
  castId: string;
}

export default function GallerySection({ castId }: Props) {
  return <GalleryEditor castId={castId} />;
}
