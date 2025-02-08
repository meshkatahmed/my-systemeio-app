import React, { useEffect, useState } from 'react';

// Utility function to count the number of records.
function countRecords(records) {
  return records.length;
}

function ContactsLogger() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function fetchContacts() {
      let localContacts = [];
      let localHasMore = true;

      while (!isCancelled && localHasMore) {
        try {
          // Build query parameters
          const params = new URLSearchParams();
          params.append('order', 'desc');
          params.append('limit', '100');

          // Use the last contact's ID as startingAfter
          if (localContacts.length > 0) {
            const lastContact = localContacts[localContacts.length - 1];
            params.append('startingAfter', lastContact.id);
          }

          const query = params.toString();
          const url = `/api/contacts?${query}`;

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': 'demo-api-key' // Replace with your actual API key.
            }
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          const newContacts = data.items;
          localContacts = localContacts.concat(newContacts);

          // Update hasMore flag
          localHasMore = data.hasMore;
          setHasMore(localHasMore);
        } catch (err) {
          if (localContacts.length === 0) {
            setError(err.message || 'An error occurred');
          }
          console.error(err);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      // Once fetching is complete, update the state and log the final records
      if (!isCancelled) {
        setContacts([...localContacts]);
        console.log('All records:', localContacts);
        console.log('Total records count:', countRecords(localContacts));
      }
    }

    fetchContacts();
    // Clean Up Once Component Unmounts
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div>
      <h1>Contacts Logger</h1>
      {error && contacts.length === 0 && (
        <p style={{ color: 'red' }}>Error: {error}</p>
      )}
      <p>
        Once all API calls finish (when hasMore becomes false), check the console for
        the final records and the total count.
      </p>
      <p>Total contacts in UI: {contacts.length}</p>
    </div>
  );
}

export default ContactsLogger;
