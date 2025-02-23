begin;
  -- Add approval workflow columns to purchase_requests
  alter table purchase_requests
    add column admin_validated boolean default false,
    add column admin_validated_at timestamptz,
    add column admin_validator uuid references auth.users(id),
    add column approval_leader_signed boolean default false,
    add column approval_leader_signed_at timestamptz,
    add column approval_leader_id uuid references auth.users(id),
    add column nom_signed boolean default false,
    add column nom_signed_at timestamptz,
    add column nom_id uuid references auth.users(id),
    add column sm_signed boolean default false,
    add column sm_signed_at timestamptz,
    add column sm_id uuid references auth.users(id),
    add column workflow_status text default 'pending_validation' 
    check (workflow_status in (
      'pending_validation',
      'pending_approval_leader',
      'pending_nom',
      'pending_sm',
      'completed',
      'rejected'
    ));

  -- Create view for approval workflow status
  create view purchase_request_approvals as
    select 
      pr.*,
      av.email as admin_validator_email,
      al.email as approval_leader_email,
      nom.email as nom_email,
      sm.email as sm_email
    from purchase_requests pr
    left join auth.users av on pr.admin_validator = av.id
    left join auth.users al on pr.approval_leader_id = al.id
    left join auth.users nom on pr.nom_id = nom.id
    left join auth.users sm on pr.sm_id = sm.id;
commit;
