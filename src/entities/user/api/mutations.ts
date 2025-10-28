import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateUserInput, User } from '@/entities/user/types'
import { apiClient } from '@/shared/api'
import { userKeys } from './keys'

/**
 * Update user mutation function
 */
async function updateUser(id: string, data: UpdateUserInput): Promise<User> {
  const response = await apiClient.put<User>(`/users/${id}`, data)
  if (!response.data) {
    throw new Error('No user data returned')
  }
  return response.data
}

/**
 * Hook to update user with optimistic updates
 *
 * @example
 * const updateUser = useUpdateUser()
 * updateUser.mutate({ id: '123', data: { name: 'New Name' } })
 */
export function useUpdateUser(
  options?: Omit<
    UseMutationOptions<
      User,
      Error,
      { id: string; data: UpdateUserInput },
      { previousUser: User | undefined }
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation<
    User,
    Error,
    { id: string; data: UpdateUserInput },
    { previousUser: User | undefined }
  >({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: userKeys.detail(id) })

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>(userKeys.detail(id))

      // Optimistically update
      if (previousUser) {
        queryClient.setQueryData<User>(userKeys.detail(id), {
          ...previousUser,
          ...data,
        })
      }

      return { previousUser }
    },
    onError: (_error, { id }, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.detail(id), context.previousUser)
      }
    },
    onSettled: (_data, _error, { id }) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
    },
    ...options,
  })
}

/**
 * Delete user mutation function
 */
async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`)
}

/**
 * Hook to delete user
 *
 * @example
 * const deleteUser = useDeleteUser()
 * deleteUser.mutate('user-id-123')
 */
export function useDeleteUser(
  options?: Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(id) })
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
    ...options,
  })
}
