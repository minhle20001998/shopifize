import { useRouter } from "next/router";
import React, { useState } from "react";

export const useTableFilter = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const router = useRouter()
  const query = router.query
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: string, title: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setId(id)
    setTitle(title)
  };

  const handleClose = () => {
    setAnchorEl(null);
    setId('')
    setTitle('')
  };

  const getIsFiltering = (id: string) => {
    return query[id] ? true : false
  }

  return {
    id, title, anchorEl, open, handleClick, handleClose, getIsFiltering
  }
}