import React, { useState } from 'react';
import {
  Popover,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  makeStyles
} from '@material-ui/core';
import { MoreVert, Check } from '@material-ui/icons';
import { connect } from 'react-redux';
import ChangeUrlDialog from './ChangeUrlDialog';
import { toggleOpenWhenDone } from '../actions';

const useStyles = makeStyles(theme => ({
  listItem: {
    padding: 0
  },
  listItemText: {
    padding: 0,
    margin: 0
  },
  button: {
    borderRadius: 0,
    textTransform: 'none',
    width: '100%'
  },
  openWhenDoneCheck: {
    float: 'left',
    marginRight: theme.spacing(1) + 'px'
  },
  iconButton: {
    padding: '10px'
  }
}));

function DownloadMoreActions({
  dispatch,
  id,
  currentUrl,
  openWhenDone = false
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setAnchorEl(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleToggleOpenWhenDone = () => {
    dispatch(toggleOpenWhenDone(id, !openWhenDone));
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);
  const classes = useStyles();

  return (
    <>
      <IconButton className={classes.iconButton} onClick={handlePopoverOpen}>
        <MoreVert fontSize="small" />
      </IconButton>

      <Popover
        className={classes.popover}
        open={popoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handlePopoverClose}
      >
        <List>
          <ListItem className={classes.listItem}>
            <ListItemText className={classes.listItemText}>
              <Button className={classes.button} onClick={handleDialogOpen}>
                Change URL
              </Button>
            </ListItemText>
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText className={classes.listItemText}>
              <Button
                className={classes.button}
                onClick={handleToggleOpenWhenDone}
              >
                <Check
                  className={classes.openWhenDoneCheck}
                  style={{ visibility: openWhenDone ? 'visible' : 'hidden' }}
                />
                Open when done
              </Button>
            </ListItemText>
          </ListItem>
        </List>
      </Popover>

      <ChangeUrlDialog
        id={id}
        currentUrl={currentUrl}
        open={dialogOpen}
        onClose={handleDialogClose}
      />
    </>
  );
}

export default connect()(DownloadMoreActions);
