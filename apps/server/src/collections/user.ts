import { isAdmin, isAdminOrCurrentUser } from '@/utils/access'
import type { CollectionConfig } from 'payload'
import { COLLECTION_SLUG_USER } from './config'
import { ADMIN_ACCESS_ROLES } from '@/plugins/authjs/auth.config'
import { revalidateUser } from '@/utils/actions'

const ADMIN_AUTH_GROUP = 'Auth'

export const users: CollectionConfig = {
  slug: COLLECTION_SLUG_USER,
  admin: {
    group: ADMIN_AUTH_GROUP,
    useAsTitle: 'email'
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        const payload = req.payload
        await revalidateUser(doc, payload)
      }
    ]
  },
  access: {
    admin: async ({ req }) => {
      return req?.user?.roles?.includes(ADMIN_ACCESS_ROLES) == true
    },
    read: isAdminOrCurrentUser,
    create: isAdmin,
    update: isAdminOrCurrentUser,
    delete: isAdminOrCurrentUser
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: "roles",
      type: "json",
      typescriptSchema: [
        () => ({
          type: "array",
          items: {
            type: "string",
          },
        }),
      ],
    },
    { name: 'stripeCustomerId', type: 'text', admin: { readOnly: true, position: 'sidebar' } },
  ]
} as const