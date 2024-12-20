import type { Access, CollectionConfig, Field } from 'payload'
import {
  permissionRelationship,
  cachePermissionSeedsHook,
} from '@/core/infrastructure/payload/fields/permissions/permissionsRelationshipFields'
import { COLLECTION_SLUG_MEDIA } from '../config'
import { checkReadPermissions, isAdmin } from '../../fields/permissions/accessEvaluations'
import { taxonomiesRelationshipBuilder } from '../../fields/taxonomies/taxonomiesRelationshipFields'

export const categoriesRelationship = taxonomiesRelationshipBuilder({
  relationship: {
    name: 'categories',
    label: 'Categorías',
  },
  seeds: { name: 'seeds', label: 'Semillas de categorías' },
})

export function contentWithPermissionsCollectionBuilder(
  config: Partial<CollectionConfig> & { slug: string },
): CollectionConfig {
  const contentCollection = contentCollectionBuilder(config)
  return {
    ...contentCollection,
    access: {
      read: checkReadPermissions,
      create: isAdmin,
      update: isAdmin,
      delete: isAdmin,
    },
    hooks: {
      ...contentCollection.hooks,
      beforeChange: [...contentCollection.hooks!.beforeChange!, cachePermissionSeedsHook()],
    },
    fields: [...permissionRelationship(), ...(contentCollection.fields ?? [])],
  }
}

export function contentCollectionBuilder(
  config: Partial<CollectionConfig> & { slug: string },
): CollectionConfig {
  return {
    ...config,
    access: {
      create: isAdmin,
      update: isAdmin,
      delete: isAdmin,
    },
    admin: {
      useAsTitle: 'title',
      group: 'Contenido',
    },
    hooks: {
      ...config.hooks,
      beforeChange: [categoriesRelationship.hook],
    },
    fields: [
      {
        name: 'cover',
        type: 'upload',
        relationTo: COLLECTION_SLUG_MEDIA,
        hasMany: false,
        required: true,
        filterOptions: {
          mimeType: { contains: 'image' },
        },
      },
      {
        name: 'title',
        type: 'text',
        localized: true,
      },
      {
        name: 'description',
        type: 'textarea',
        localized: true,
      },
      {
        name: 'publishedAt',
        label: 'Fecha de publicación',
        required: true,
        type: 'date',
      },
      ...categoriesRelationship.fields,
      ...(config.fields ?? []),
    ],
  }
}