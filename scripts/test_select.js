const { data, error } = await supabase.from('blogs').select('*').limit(1);
console.log(JSON.stringify(data, null, 2));
console.log(error);
