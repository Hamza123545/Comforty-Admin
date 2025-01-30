import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

// Fetch the token securely from the environment variable
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token: process.env.SANITY_API_TOKEN, // Use the private API token
});
