import React from 'react';
import CatalogManager from '../../components/admin/CatalogManager';
import { api } from '../../services/api';

const COPY = {
  title: 'Event Services',
  description: 'Manage individual production services, stage decor, audio/visual setups, and pricing.',
  noun: 'Service',
  plural: 'Services',
  modalSubtitle: 'Configure service title, description, image, and base pricing',
  namePlaceholder: 'e.g. Architectural Uplighting & Haze',
  descriptionPlaceholder: 'Describe the inclusions, technical specs, and features of this service...',
};

export default function AdminServicesPage() {
  return <CatalogManager resource={api.admin.services} copy={COPY} withImage />;
}
