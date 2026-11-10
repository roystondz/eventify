import React from 'react';
import CatalogManager from '../../components/admin/CatalogManager';
import { api } from '../../services/api';

const COPY = {
  title: 'Event Add-ons & Effects',
  description: 'Manage special effects (cold sparks, low fog, 360 photobooth, drones) and upgrade equipment.',
  noun: 'Add-on',
  plural: 'Add-ons',
  modalSubtitle: 'Configure upgrade effect, description, and pricing',
  namePlaceholder: 'e.g. 360-Degree Video Booth with Props',
  descriptionPlaceholder: 'Describe equipment specifications, duration, and safety features...',
};

export default function AdminAddonsPage() {
  return <CatalogManager resource={api.admin.addons} copy={COPY} />;
}
